import { Download, FileText, ArrowLeft } from 'lucide-react';
import { GeneratedContent, FormData } from '../types';
import { translations, Language } from '../lib/translations';

interface SheetDisplayProps {
  content: GeneratedContent;
  formData: FormData;
  language: Language;
  onDownload: () => void;
  onNewSheet: () => void;
}

export function SheetDisplay({ content, formData, language, onDownload, onNewSheet }: SheetDisplayProps) {
  const t = translations[language].sheet;
  const isRtl = language === 'ar';

  // Calculer la durée totale en minutes
  const getTotalMinutes = (dureeStr: string): number => {
    const matches = dureeStr.match(/(\d+)/g);
    if (!matches) return 60; // Valeur par défaut

    if (dureeStr.includes('ساعة') || dureeStr.includes('heure')) {
      const heures = parseInt(matches[0]);
      const minutes = matches.length > 1 ? parseInt(matches[1]) : 0;
      return heures * 60 + minutes;
    }
    return parseInt(matches[0]); // Si c'est déjà en minutes
  };

  const totalMinutes = getTotalMinutes(formData.duree);

  // Répartition proportionnelle: Révision 15%, Imprégnation 20%, Analyse 30%, Consolidation 25%, Évaluation 10%
  const durations = {
    revision: Math.round(totalMinutes * 0.15),
    impregnation: Math.round(totalMinutes * 0.20),
    analyse: Math.round(totalMinutes * 0.30),
    consolidation: Math.round(totalMinutes * 0.25),
    evaluation: Math.round(totalMinutes * 0.10),
  };

  const sections = [
    { key: 'revision', title: t.revision, data: content.revision, duration: durations.revision },
    { key: 'impregnation', title: t.impregnation, data: content.impregnation, duration: durations.impregnation },
    { key: 'analyse', title: t.analyse, data: content.analyse, duration: durations.analyse },
    { key: 'consolidation', title: t.consolidation, data: content.consolidation, duration: durations.consolidation },
    { key: 'evaluation', title: t.evaluation, data: content.evaluation, duration: durations.evaluation },
  ];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8" id="sheet-content">
        <div className="pb-6 mb-8 border-b-4 border-blue-600">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{formData.lecon}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">{translations[language].form.niveau}:</span>
              <span className="ml-2 text-gray-600">{formData.niveau}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">{translations[language].form.activite}:</span>
              <span className="ml-2 text-gray-600">{formData.activite}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">{translations[language].form.duree}:</span>
              <span className="ml-2 text-gray-600">{formData.duree}</span>
            </div>
            {formData.competence_base && (
              <div className="col-span-2">
                <span className="font-semibold text-gray-700">{translations[language].form.competence}:</span>
                <span className="ml-2 text-gray-600">{formData.competence_base}</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <span className="font-semibold text-gray-700">{translations[language].form.objectif}:</span>
            <p className="mt-1 text-gray-600">{formData.objectif_specifique}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="border-2 border-blue-300 px-4 py-3 text-left font-bold text-blue-900 uppercase text-sm">
                  {language === 'ar' ? 'المراحل' : 'ÉTAPES'}
                </th>
                <th className="border-2 border-blue-300 px-4 py-3 text-left font-bold text-blue-900 uppercase text-sm">
                  {t.activitesMaitre}
                </th>
                <th className="border-2 border-blue-300 px-4 py-3 text-left font-bold text-blue-900 uppercase text-sm">
                  {t.activitesEleve}
                </th>
                <th className="border-2 border-blue-300 px-4 py-3 text-left font-bold text-blue-900 uppercase text-sm">
                  {t.contenu}
                </th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.key} className="hover:bg-blue-50 transition-colors">
                  <td className="border-2 border-blue-200 px-4 py-4 align-top">
                    <div className="font-bold text-blue-700 text-base mb-1">
                      {section.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {language === 'ar'
                        ? `${section.duration} ${section.duration === 1 ? 'دقيقة' : 'دقائق'}`
                        : `${section.duration} min`
                      }
                    </div>
                  </td>
                  <td className="border-2 border-blue-200 px-4 py-4 align-top bg-blue-50/50">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                      {section.data.activites_maitre}
                    </p>
                  </td>
                  <td className="border-2 border-blue-200 px-4 py-4 align-top">
                    <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                      {section.data.activites_eleve}
                    </p>
                  </td>
                  <td className="border-2 border-blue-200 px-4 py-4 align-top bg-gray-50 italic">
                    <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                      {section.data.contenu}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={onNewSheet}
          className="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === 'ar' ? 'رجوع' : 'Retour'}
        </button>
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Download className="w-5 h-5" />
          {t.download}
        </button>
        <button
          onClick={onNewSheet}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <FileText className="w-5 h-5" />
          {t.newSheet}
        </button>
      </div>
    </div>
  );
}
