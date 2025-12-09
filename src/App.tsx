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
          border-bottom: 4px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        h2 {
          font-size: 28px;
          margin-bottom: 15px;
          color: #111827;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          font-size: 14px;
          margin-bottom: 15px;
        }
        .info-item { margin-bottom: 5px; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6b7280; }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1d4ed8;
          padding-bottom: 8px;
          border-bottom: 2px solid #bfdbfe;
          margin-bottom: 15px;
        }
        .activity-box {
          padding: 15px;
          margin-bottom: 12px;
          border-radius: 8px;
        }
        .maitre { background-color: #eff6ff; }
        .eleve { background-color: #f0fdf4; }
        .contenu { background-color: #fffbeb; }
        .activity-title {
          font-weight: bold;
          margin-bottom: 8px;
        }
        .maitre .activity-title { color: #1e3a8a; }
        .eleve .activity-title { color: #14532d; }
        .contenu .activity-title { color: #78350f; }
        .activity-content {
          color: #1f2937;
          white-space: pre-wrap;
          line-height: 1.6;
        }
        @media print {
          body { padding: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    `;

    const sections = [
      { title: t.sheet.revision, data: generatedContent.revision },
      { title: t.sheet.impregnation, data: generatedContent.impregnation },
      { title: t.sheet.analyse, data: generatedContent.analyse },
      { title: t.sheet.consolidation, data: generatedContent.consolidation },
      { title: t.sheet.evaluation, data: generatedContent.evaluation },
    ];

    const sectionsHtml = sections.map(section => `
      <div class="section">
        <h3 class="section-title">${section.title}</h3>
        <div class="activity-box maitre">
          <div class="activity-title">${t.sheet.activitesMaitre}</div>
          <div class="activity-content">${section.data.activites_maitre}</div>
        </div>
        <div class="activity-box eleve">
          <div class="activity-title">${t.sheet.activitesEleve}</div>
          <div class="activity-content">${section.data.activites_eleve}</div>
        </div>
        <div class="activity-box contenu">
          <div class="activity-title">${t.sheet.contenu}</div>
          <div class="activity-content">${section.data.contenu}</div>
        </div>
      </div>
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
            <h2>${currentFormData.lecon}</h2>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">${translations[language].form.niveau}:</span>
                <span class="value">${currentFormData.niveau}</span>
              </div>
              <div class="info-item">
                <span class="label">${translations[language].form.activite}:</span>
                <span class="value">${currentFormData.activite}</span>
              </div>
              <div class="info-item">
                <span class="label">${translations[language].form.duree}:</span>
                <span class="value">${currentFormData.duree}</span>
              </div>
              ${currentFormData.competence_base ? `
                <div class="info-item">
                  <span class="label">${translations[language].form.competence}:</span>
                  <span class="value">${currentFormData.competence_base}</span>
                </div>
              ` : ''}
            </div>
            <div class="info-item" style="margin-top: 10px;">
              <span class="label">${translations[language].form.objectif}:</span>
              <div class="value" style="margin-top: 5px;">${currentFormData.objectif_specifique}</div>
            </div>
          </div>
          ${sectionsHtml}
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
            <div className="flex items-center gap-2 md:gap-3">
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
