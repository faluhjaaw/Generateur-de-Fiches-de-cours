export interface SheetSection {
  activites_maitre: string;
  activites_eleve: string;
  contenu: string;
}

export interface GeneratedContent {
  revision: SheetSection;
  impregnation: SheetSection;
  analyse: SheetSection;
  consolidation: SheetSection;
  evaluation: SheetSection;
}

export interface EducationalSheet {
  id: string;
  niveau: string;
  activite: string;
  lecon: string;
  objectif_specifique: string;
  duree: string;
  competence_base?: string;
  infos_supplementaires?: string;
  generated_content: GeneratedContent;
  language: string;
  created_at: string;
}

export interface FormData {
  niveau: string;
  activite: string;
  lecon: string;
  objectif_specifique: string;
  duree: string;
  competence_base: string;
  infos_supplementaires: string;
}
