import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  niveau: string;
  activite: string;
  lecon: string;
  objectif_specifique: string;
  duree: string;
  competence_base?: string;
  infos_supplementaires?: string;
  language: string;
  geminiApiKey: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const requestData: GenerateRequest = await req.json();
    const {
      niveau,
      activite,
      lecon,
      objectif_specifique,
      duree,
      competence_base,
      infos_supplementaires,
      language,
      geminiApiKey
    } = requestData;

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const isArabic = language === 'ar';
    const systemPrompt = isArabic
      ? `أنت مساعد تربوي متخصص في إنشاء بطاقات تعليمية مفصلة. قم بإنشاء بطاقة تعليمية كاملة باللغة العربية بناءً على المعلومات المقدمة. يجب أن تتضمن البطاقة جميع الأقسام المطلوبة بشكل مفصل وعملي. أعد الرد بصيغة JSON فقط، بدون أي نص إضافي.`
      : `Tu es un assistant pédagogique spécialisé dans la création de fiches pédagogiques détaillées. Génère une fiche pédagogique complète en français basée sur les informations fournies. La fiche doit inclure toutes les sections requises de manière détaillée et pratique. Réponds UNIQUEMENT avec du JSON valide, sans texte supplémentaire.`;

    const userPrompt = isArabic
      ? `قم بإنشاء بطاقة تعليمية مفصلة مع المعلومات التالية:

المستوى: ${niveau}
النشاط: ${activite}
الدرس: ${lecon}
الهدف المحدد: ${objectif_specifique}
المدة: ${duree}
${competence_base ? `الكفاءة الأساسية: ${competence_base}\n` : ''}
${infos_supplementaires ? `معلومات إضافية: ${infos_supplementaires}\n` : ''}

يجب أن تتضمن البطاقة الأقسام التالية:
1. المراجعة
2. التمهيد/وضع الموقف
3. التحليل/الإنتاج الموجه
4. التعزيز/التثبيت
5. التصحيح/التقييم

لكل قسم، قدم:
- أنشطة المعلم
- أنشطة التلميذ
- المحتوى/الملاحظات

أعد النتيجة بتنسيق JSON التالي:
{
  "revision": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." },
  "impregnation": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." },
  "analyse": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." },
  "consolidation": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." },
  "evaluation": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." }
}`
      : `Génère une fiche pédagogique détaillée avec les informations suivantes:

Niveau: ${niveau}
Activité: ${activite}
Leçon: ${lecon}
Objectif spécifique: ${objectif_specifique}
Durée: ${duree}
${competence_base ? `Compétence de base: ${competence_base}\n` : ''}
${infos_supplementaires ? `Informations supplémentaires: ${infos_supplementaires}\n` : ''}

La fiche doit inclure les étapes suivantes:
1. Révision
2. Imprégnation/Mise en situation
3. Analyse/Production Dirigée
4. Consolidation/Fixation
5. Correction/Évaluation

Pour chaque étape, fournis:
- Activités du maître
- Activités de l'élève
- Contenu/Observation

Retourne le résultat au format JSON suivant:
{
  "revision": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." },
  "impregnation": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." },
  "analyse": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." },
  "consolidation": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." },
  "evaluation": { "activites_maitre": "...", "activites_eleve": "...", "contenu": "..." }
}`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, {
      method: "POST",
      headers: {
        "x-goog-api-key": geminiApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\n${userPrompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();

    // Vérifier que la réponse contient des candidats
    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      throw new Error("No response generated from Gemini API");
    }

    const generatedText = geminiData.candidates[0].content.parts[0].text;

    // Nettoyer le texte des balises markdown potentielles
    let cleanedText = generatedText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Extraire le JSON
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Generated text:", generatedText);
      throw new Error("Could not extract JSON from AI response");
    }

    const generatedContent = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({ content: generatedContent }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error generating educational sheet:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An error occurred" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});