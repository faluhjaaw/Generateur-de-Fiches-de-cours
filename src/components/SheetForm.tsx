import { useState } from 'react';
import { FileText } from 'lucide-react';
import { FormData } from '../types';
import { translations, Language } from '../lib/translations';

interface SheetFormProps {
  onSubmit: (data: FormData, apiKey: string) => void;
  isGenerating: boolean;
  language: Language;
}

export function SheetForm({ onSubmit, isGenerating, language }: SheetFormProps) {
  const t = translations[language].form;
  const errors = translations[language].errors;
  const isRtl = language === 'ar';

  // Options pour le niveau scolaire
  const niveauxOptions = language === 'ar'
    ? ['القسم التحضيري', 'السنة الأولى', 'السنة الثانية', 'السنة الثالثة', 'السنة الرابعة', 'السنة الخامسة']
    : ['CI (Cours d\'Initiation)', 'CP (Cours Préparatoire)', 'CE1 (Cours Élémentaire 1)', 'CE2 (Cours Élémentaire 2)', 'CM1 (Cours Moyen 1)', 'CM2 (Cours Moyen 2)'];

  // Options pour les activités
  const activitesOptions = language === 'ar'
    ? ['القراءة', 'الكتابة', 'القواعد', 'التعبير', 'الرياضيات', 'العلوم', 'التاريخ والجغرافيا', 'التربية المدنية', 'التربية الإسلامية', 'التربية الفنية', 'التربية البدنية', 'اللغة الفرنسية']
    : ['Lecture', 'Écriture', 'Grammaire', 'Conjugaison', 'Orthographe', 'Expression orale/écrite', 'Mathématiques', 'Sciences', 'Histoire-Géographie', 'Éducation civique', 'Éducation islamique', 'Arts plastiques', 'Éducation physique', 'Langue française'];

  // Options pour la durée
  const dureeOptions = language === 'ar'
    ? ['30 دقيقة', '45 دقيقة', '1 ساعة', '1 ساعة 30 دقيقة', '2 ساعة']
    : ['30 minutes', '45 minutes', '1 heure', '1 heure 30', '2 heures'];

  const [formData, setFormData] = useState<FormData>({
    niveau: '',
    activite: '',
    lecon: '',
    objectif_specifique: '',
    duree: '',
    competence_base: '',
    infos_supplementaires: '',
  });

  const [apiKey, setApiKey] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const requiredFields: (keyof FormData)[] = ['niveau', 'activite', 'lecon', 'objectif_specifique', 'duree'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = errors.required;
      }
    });

    if (!apiKey) {
      newErrors.apiKey = errors.apiKeyRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    onSubmit(formData, apiKey);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.niveau} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.niveau}
            onChange={(e) => handleChange('niveau', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.niveau ? 'border-red-500' : 'border-gray-300'
            } ${isRtl ? 'text-right' : ''}`}
          >
            <option value="">{language === 'ar' ? 'اختر المستوى' : 'Sélectionner le niveau'}</option>
            {niveauxOptions.map((niveau, index) => (
              <option key={index} value={niveau}>{niveau}</option>
            ))}
          </select>
          {formErrors.niveau && <p className="mt-1 text-sm text-red-500">{formErrors.niveau}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.activite} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.activite}
            onChange={(e) => handleChange('activite', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.activite ? 'border-red-500' : 'border-gray-300'
            } ${isRtl ? 'text-right' : ''}`}
          >
            <option value="">{language === 'ar' ? 'اختر النشاط' : 'Sélectionner l\'activité'}</option>
            {activitesOptions.map((activite, index) => (
              <option key={index} value={activite}>{activite}</option>
            ))}
          </select>
          {formErrors.activite && <p className="mt-1 text-sm text-red-500">{formErrors.activite}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.lecon} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lecon}
            onChange={(e) => handleChange('lecon', e.target.value)}
            placeholder={t.leconPlaceholder}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.lecon ? 'border-red-500' : 'border-gray-300'
            } ${isRtl ? 'text-right' : ''}`}
          />
          {formErrors.lecon && <p className="mt-1 text-sm text-red-500">{formErrors.lecon}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.duree} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.duree}
            onChange={(e) => handleChange('duree', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              formErrors.duree ? 'border-red-500' : 'border-gray-300'
            } ${isRtl ? 'text-right' : ''}`}
          >
            <option value="">{language === 'ar' ? 'اختر المدة' : 'Sélectionner la durée'}</option>
            {dureeOptions.map((duree, index) => (
              <option key={index} value={duree}>{duree}</option>
            ))}
          </select>
          {formErrors.duree && <p className="mt-1 text-sm text-red-500">{formErrors.duree}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.objectif} <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.objectif_specifique}
          onChange={(e) => handleChange('objectif_specifique', e.target.value)}
          placeholder={t.objectifPlaceholder}
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            formErrors.objectif_specifique ? 'border-red-500' : 'border-gray-300'
          } ${isRtl ? 'text-right' : ''}`}
        />
        {formErrors.objectif_specifique && <p className="mt-1 text-sm text-red-500">{formErrors.objectif_specifique}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.competence}
        </label>
        <input
          type="text"
          value={formData.competence_base}
          onChange={(e) => handleChange('competence_base', e.target.value)}
          placeholder={t.competencePlaceholder}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isRtl ? 'text-right' : ''
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.infos}
        </label>
        <textarea
          value={formData.infos_supplementaires}
          onChange={(e) => handleChange('infos_supplementaires', e.target.value)}
          placeholder={t.infosPlaceholder}
          rows={3}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isRtl ? 'text-right' : ''
          }`}
        />
      </div>

      <div className="border-t pt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.apiKey} <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={t.apiKeyPlaceholder}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            formErrors.apiKey ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {formErrors.apiKey && <p className="mt-1 text-sm text-red-500">{formErrors.apiKey}</p>}
        <p className="mt-2 text-sm text-gray-500">{t.apiKeyHelp}</p>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{t.generating}</span>
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            <span>{t.generate}</span>
          </>
        )}
      </button>
    </form>
  );
}
