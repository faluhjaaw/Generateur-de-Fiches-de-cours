import { useState } from 'react';
import { Languages, History } from 'lucide-react';
import { SheetForm } from './components/SheetForm';
import { SheetDisplay } from './components/SheetDisplay';
import { SheetHistory } from './components/SheetHistory';
import { Logo } from './components/Logo';
import { FormData, GeneratedContent } from './types';
import { translations, Language } from './lib/translations';
import { supabase } from './lib/supabase';

function App() {
  const [language, setLanguage] = useState<Language>('fr');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const t = translations[language];
  const isRtl = language === 'ar';

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'ar' : 'fr');
  };

  const handleGenerate = async (formData: FormData, apiKey: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const supabaseUrl = "https://rjocagdqhwzniyzhgcvh.supabase.co";
      const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqb2NhZ2RxaHd6bml5emhnY3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMjk2NTgsImV4cCI6MjA4MDgwNTY1OH0.3YjIKF_rytHEtrTgGtxDw5Px53XP_XXsx-H4kgpZRjE";

      const response = await fetch(`${supabaseUrl}/functions/v1/generate-educational-sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          ...formData,
          language,
          geminiApiKey: apiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate sheet');
      }

      const data = await response.json();
      const content = data.content;

      const { data: savedData, error: dbError } = await supabase
        .from('educational_sheets')
        .insert({
          niveau: formData.niveau,
          activite: formData.activite,
          lecon: formData.lecon,
          objectif_specifique: formData.objectif_specifique,
          duree: formData.duree,
          competence_base: formData.competence_base || null,
          infos_supplementaires: formData.infos_supplementaires || null,
          generated_content: content,
          language,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error saving to database:', dbError);
        // Afficher un avertissement mais ne pas bloquer l'affichage
        console.warn('La fiche a été générée mais n\'a pas pu être sauvegardée dans la base de données');
      } else {
        console.log('Fiche sauvegardée avec succès:', savedData);
      }

      setGeneratedContent(content);
      setCurrentFormData(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errors.generationFailed);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedContent || !currentFormData) return;

    const content = document.getElementById('sheet-content');
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const styles = `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Arial', sans-serif;
          padding: 20px;
          direction: ${isRtl ? 'rtl' : 'ltr'};
        }
        .header {
          text-align: center;
          padding-bottom: 15px;
          margin-bottom: 20px;
          border-bottom: 2px solid #d1d5db;
        }
        .header-subtitle {
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
          color: #6b7280;
        }
        h2 {
          font-size: 32px;
          margin: 0;
          color: #111827;
        }
        .info-box {
          background-color: #f9fafb;
          border-left: 4px solid #2563eb;
          padding: 15px;
          margin-bottom: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          font-size: 13px;
        }
        .info-item {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .label {
          font-weight: bold;
          color: #374151;
          white-space: nowrap;
        }
        .value { color: #6b7280; }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        thead tr {
          background-color: #dbeafe;
        }

        th {
          border: 2px solid #93c5fd;
          padding: 12px;
          text-align: ${isRtl ? 'right' : 'left'};
          font-weight: bold;
          color: #1e3a8a;
          text-transform: uppercase;
          font-size: 12px;
        }

        td {
          border: 2px solid #bfdbfe;
          padding: 12px;
          vertical-align: top;
          font-size: 12px;
          line-height: 1.6;
          text-align: ${isRtl ? 'right' : 'left'};
        }

        .etape-title {
          font-weight: bold;
          color: #1d4ed8;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .etape-duration {
          font-size: 11px;
          color: #6b7280;
        }

        .col-maitre {
          background-color: rgba(239, 246, 255, 0.5);
        }

        .col-contenu {
          background-color: #f9fafb;
          font-style: italic;
          color: #4b5563;
        }
        @media print {
          body { padding: 10px; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      </style>
    `;

    // Calculer la durée totale en minutes
    const getTotalMinutes = (dureeStr: string): number => {
      if (!dureeStr) return 60; // Valeur par défaut

      // Cas : "1 heure 30", "1h30", "1 ساعة 30", etc.
      if (dureeStr.includes('ساعة') || dureeStr.includes('heure') || dureeStr.includes('h')) {
        const matches = dureeStr.match(/(\d+)/g);
        if (!matches) return 60;

        const heures = parseInt(matches[0]);
        const minutes = matches.length > 1 ? parseInt(matches[1]) : 0;
        return heures * 60 + minutes;
      }

      // Cas : "30 minutes", "45 دقيقة", etc.
      const matches = dureeStr.match(/(\d+)/g);
      if (matches) {
        return parseInt(matches[0]);
      }

      return 60; // Valeur par défaut
    };

    const totalMinutes = getTotalMinutes(currentFormData.duree);

    const durations = {
      revision: Math.round(totalMinutes * 0.15),
      impregnation: Math.round(totalMinutes * 0.20),
      analyse: Math.round(totalMinutes * 0.30),
      consolidation: Math.round(totalMinutes * 0.25),
      evaluation: Math.round(totalMinutes * 0.10),
    };

    const sections = [
      { key: 'revision', title: t.sheet.revision, data: generatedContent.revision, duration: durations.revision },
      { key: 'impregnation', title: t.sheet.impregnation, data: generatedContent.impregnation, duration: durations.impregnation },
      { key: 'analyse', title: t.sheet.analyse, data: generatedContent.analyse, duration: durations.analyse },
      { key: 'consolidation', title: t.sheet.consolidation, data: generatedContent.consolidation, duration: durations.consolidation },
      { key: 'evaluation', title: t.sheet.evaluation, data: generatedContent.evaluation, duration: durations.evaluation },
    ];

    const sectionsHtml = sections.map(section => `
      <tr>
        <td>
          <div class="etape-title">${section.title}</div>
          <div class="etape-duration">
            ${isRtl
              ? `${section.duration} ${section.duration === 1 ? 'دقيقة' : 'دقائق'}`
              : `${section.duration} min`
            }
          </div>
        </td>
        <td class="col-maitre">${section.data.activites_maitre}</td>
        <td>${section.data.activites_eleve}</td>
        <td class="col-contenu">${section.data.contenu}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${currentFormData.lecon}</title>
          ${styles}
        </head>
        <body>
          <div class="header">
            <div class="header-subtitle">${currentFormData.activite} - ${currentFormData.niveau}</div>
            <h2>${currentFormData.lecon}</h2>
            ${currentFormData.competence_base ? `
              <p style="font-size: 13px; color: #6b7280; margin-top: 12px;">
                <span style="font-weight: 600;">${translations[language].form.competence}:</span> ${currentFormData.competence_base}
              </p>
            ` : ''}
          </div>

          <div class="info-box">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">${translations[language].form.duree}:</span>
                <span class="value">${currentFormData.duree}</span>
              </div>
              <div class="info-item">
                <span class="label">${translations[language].form.objectif}:</span>
                <span class="value">${currentFormData.objectif_specifique}</span>
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>${language === 'ar' ? 'المراحل' : 'ÉTAPES'}</th>
                <th>${t.sheet.activitesMaitre}</th>
                <th>${t.sheet.activitesEleve}</th>
                <th>${t.sheet.contenu}</th>
              </tr>
            </thead>
            <tbody>
              ${sectionsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleNewSheet = () => {
    setGeneratedContent(null);
    setCurrentFormData(null);
    setError(null);
    setShowHistory(false);
  };

  const handleSelectHistorySheet = (sheet: any) => {
    setCurrentFormData({
      niveau: sheet.niveau,
      activite: sheet.activite,
      lecon: sheet.lecon,
      objectif_specifique: sheet.objectif_specifique,
      duree: sheet.duree,
      competence_base: sheet.competence_base || '',
      infos_supplementaires: sheet.infos_supplementaires || '',
    });
    setGeneratedContent(sheet.generated_content);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-blue-50" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header avec effet glassmorphism */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div
              className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleNewSheet}
            >
              <Logo className="w-10 h-10 md:w-12 md:h-12" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-blue-600">
                  {t.title}
                </h1>
                <p className="text-xs md:text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm flex-1 sm:flex-initial"
              >
                <History className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                <span className="font-medium text-gray-700 text-sm md:text-base">{language === 'ar' ? 'السجل' : 'Historique'}</span>
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-1 md:gap-2 px-2 md:px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex-1 sm:flex-initial"
              >
                <Languages className="w-4 h-4 md:w-5 md:h-5" />
                <span className="font-medium text-sm md:text-base">{language === 'fr' ? 'العربية' : 'Français'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">

          {error && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl text-red-700 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {showHistory ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
              <SheetHistory
                language={language}
                onSelectSheet={handleSelectHistorySheet}
                onBack={() => setShowHistory(false)}
              />
            </div>
          ) : !generatedContent ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
              <SheetForm
                onSubmit={handleGenerate}
                isGenerating={isGenerating}
                language={language}
              />
            </div>
          ) : (
            <SheetDisplay
              content={generatedContent}
              formData={currentFormData!}
              language={language}
              onDownload={handleDownload}
              onNewSheet={handleNewSheet}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
