import { NextRequest, NextResponse } from "next/server";
import { isOpenAIConfigured, openai, OPENAI_MODEL } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    if (!isOpenAIConfigured || !openai) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY haijawekwa." },
        { status: 500 },
      );
    }

    const body = await req.json();
    const topic = String(body?.topic || "").trim();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic ni lazima." },
        { status: 400 },
      );
    }

    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      tools: [{ type: "web_search" }],
      tool_choice: "auto",
      text: {
        format: {
          type: "json_schema",
          name: "story_research_bundle",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              category: { type: "string" },
              short_description: { type: "string" },
              story_summary: { type: "string" },
              full_story_text: { type: "string" },
              narrator_profile_id: { type: "string" },
              timeline: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    event_date: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["event_date", "title", "description"],
                },
              },
              sources: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    source_title: { type: "string" },
                    publisher: { type: "string" },
                    source_url: { type: "string" },
                    notes: { type: "string" },
                  },
                  required: ["source_title", "publisher", "source_url", "notes"],
                },
              },
              quotes: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    quote: { type: "string" },
                    speaker: { type: "string" },
                    context: { type: "string" },
                  },
                  required: ["quote", "speaker", "context"],
                },
              },
            },
            required: [
              "title",
              "category",
              "short_description",
              "story_summary",
              "full_story_text",
              "narrator_profile_id",
              "timeline",
              "sources",
              "quotes",
            ],
          },
        },
      },
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "Wewe ni mtafiti wa true stories kwa portal ya HistoSauti. Tafuta taarifa za kweli kutoka web search, kisha andaa output ya JSON tu. Usibuni facts. Tumia style ya Kiswahili cha Afrika Mashariki. Full story iwe draft ya documentary narration ya Kiswahili. Sources ziwe halisi na zenye URL. Category iwe moja kati ya: disasters, mystery, politics, biography, war, justice, survival. narrator_profile_id iwe moja kati ya: east-africa-documentary, east-africa-calm-female, east-africa-investigative.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                `Research true historical information about this topic: ${topic}.
Return:
1. clean title
2. category
3. short description
4. story summary
5. full story draft in East African Swahili
6. timeline with dates
7. sources with URLs
8. notable quotes if available
9. best narrator profile id

Only include information you can support from sources.`,
            },
          ],
        },
      ],
    });

    const raw = response.output_text || "{}";
    const parsed = JSON.parse(raw);

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error("RESEARCH_STORY_ERROR:", error);
    return NextResponse.json(
      { error: "Research failed" },
      { status: 500 },
    );
  }
}