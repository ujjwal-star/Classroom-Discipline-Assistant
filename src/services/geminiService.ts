import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DisciplineSuggestion {
  correctiveAction: string;
  educationalTask: string;
  encouragementMessage: string;
  reasoning: string;
}

export async function getDisciplineSuggestion(
  studentName: string,
  behavior: string,
  frequency: string,
  classType: string
): Promise<DisciplineSuggestion> {
  const prompt = `As a Classroom Discipline Assistant, suggest a mild, constructive, and educational corrective action for the following situation:
  - Student Name: ${studentName}
  - Student Behavior: ${behavior}
  - Frequency: ${frequency}
  - Class Type: ${classType}

  Rules:
  - Use the student's name (${studentName}) in the corrective action and encouragement message where appropriate to make it personal.
  - Do not suggest harsh or physical punishments.
  - Do not insult or shame the student.
  - Focus on learning and improvement.
  - Keep actions respectful and constructive.

  Provide the response in JSON format with the following fields:
  - correctiveAction: A mild corrective action (e.g., ask to summarize, sit in front, etc.)
  - educationalTask: A task related to the current learning topic.
  - encouragementMessage: A positive message to motivate the student.
  - reasoning: Why this specific action helps the student improve without being punitive.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          correctiveAction: { type: Type.STRING },
          educationalTask: { type: Type.STRING },
          encouragementMessage: { type: Type.STRING },
          reasoning: { type: Type.STRING },
        },
        required: ["correctiveAction", "educationalTask", "encouragementMessage", "reasoning"],
      },
    },
  });

  const text = response.text || "{}";
  return JSON.parse(text) as DisciplineSuggestion;
}
