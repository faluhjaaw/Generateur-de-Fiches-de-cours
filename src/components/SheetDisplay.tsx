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

  const sections = [
    { key: 'revision', title: t.revision, data: content.revision },
    { key: 'impregnation', title: t.impregnation, data: content.impregnation },
    { key: 'analyse', title: t.analyse, data: content.analyse },
    { key: 'consolidation', title: t.consolidation, data: content.consolidation },
    { key: 'evaluation', title: t.evaluation, data: content.evaluation },
  ];

  return (
    <div className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-lg p-8" id="sheet-content">
        <div className="border-b-4 border-blue-600 pb-6 mb-8">
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

        {sections.map((section) => (
          <div key={section.key} className="mb-8 last:mb-0">
            <h3 className="text-xl font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-200">
              {section.title}
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">{t.activitesMaitre}</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{section.data.activites_maitre}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">{t.activitesEleve}</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{section.data.activites_eleve}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">{t.contenu}</h4>
                <p className="text-gray-800 whitespace-pre-wrap">{section.data.contenu}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={onNewSheet}
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
        >
          <ArrowLeft className="w-5 h-5" />
          {language === 'ar' ? 'رجوع' : 'Retour'}
        </button>
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Download className="w-5 h-5" />
          {t.download}
        </button>
        <button
          onClick={onNewSheet}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <FileText className="w-5 h-5" />
          {t.newSheet}
        </button>
      </div>
    </div>
  );
}
