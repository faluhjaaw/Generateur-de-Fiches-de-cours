import { useState, useEffect } from 'react';
import { History, FileText, Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GeneratedContent } from '../types';
import { translations, Language } from '../lib/translations';

interface HistorySheet {
  id: string;
  niveau: string;
  activite: string;
  lecon: string;
  objectif_specifique: string;
  duree: string;
  competence_base: string | null;
  infos_supplementaires: string | null;
  generated_content: GeneratedContent;
  language: string;
  created_at: string;
}

interface SheetHistoryProps {
  language: Language;
  onSelectSheet: (sheet: HistorySheet) => void;
  onBack: () => void;
}

export function SheetHistory({ language, onSelectSheet, onBack }: SheetHistoryProps) {
  const [sheets, setSheets] = useState<HistorySheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language];
  const isRtl = language === 'ar';

  useEffect(() => {
    loadSheets();
  }, []);

  const loadSheets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('educational_sheets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setSheets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
      console.error('Error loading sheets:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">{language === 'ar' ? 'جاري التحميل...' : 'Chargement...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (sheets.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          {language === 'ar' ? 'لا توجد بطاقات محفوظة' : 'Aucune fiche sauvegardée'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <History className="w-6 h-6" />
          {language === 'ar' ? 'سجل البطاقات' : 'Historique des fiches'}
        </h3>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">{language === 'ar' ? 'رجوع' : 'Retour'}</span>
        </button>
      </div>

      <div className="grid gap-4">
        {sheets.map((sheet) => (
          <div
            key={sheet.id}
            onClick={() => onSelectSheet(sheet)}
            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">{sheet.lecon}</h4>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">{t.form.niveau}:</span> {sheet.niveau}
                  </p>
                  <p>
                    <span className="font-medium">{t.form.activite}:</span> {sheet.activite}
                  </p>
                  <p>
                    <span className="font-medium">{t.form.duree}:</span> {sheet.duree}
                  </p>
                </div>
              </div>

              <div className="text-right text-sm text-gray-500">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(sheet.created_at)}</span>
                </div>
                <div className="text-xs">
                  {sheet.language === 'ar' ? '🇩🇿 العربية' : '🇫🇷 Français'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
