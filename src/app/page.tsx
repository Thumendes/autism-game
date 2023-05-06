import { Board } from "@/components/game/board";
import { QuestionsSheets } from "@/lib/sheets";

export default async function Home() {
  const googleSheets = await QuestionsSheets.create();

  const data = await googleSheets.getQuestions();

  return (
    <main>
      <Board questions={data} />
    </main>
  );
}
