import { sheets, sheets_v4 } from "@googleapis/sheets";
import { z } from "zod";

const valuesSchema = z.array(z.array(z.string()));

export interface Answer {
  label: string;
  correct: boolean;
}

export interface Question {
  question: string;
  answers: Answer[];
}

export class QuestionsSheets {
  static instance: QuestionsSheets;
  private sheets: sheets_v4.Sheets;

  private constructor() {
    this.sheets = sheets({ version: "v4", auth: process.env.API_KEY });
  }

  static async create() {
    if (!QuestionsSheets.instance) {
      QuestionsSheets.instance = new QuestionsSheets();
    }

    return QuestionsSheets.instance;
  }

  async getQuestions() {
    const id = process.env.SPREADSHEET_ID as string;

    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: "Perguntas!A:B",
    });

    const lines = valuesSchema.parse(response.data.values);

    const questions: Question[] = [];
    let currentQuestion: string | null = null;
    for (const row of lines) {
      if (!row[0]) continue;

      if (row[0].match(/\#\d+.*/i)) {
        currentQuestion = row[0];
        questions.push({ question: currentQuestion.replace(/\#\d+/, "").trim(), answers: [] });
      }

      if (row[0].match(/\w\).*/i)) {
        if (currentQuestion) {
          questions[questions.length - 1].answers.push({
            label: row[0].replace(/\w\)/, "").trim(),
            correct: row[1] === "✅",
          });
        }
      }
    }

    return questions;
  }
}
