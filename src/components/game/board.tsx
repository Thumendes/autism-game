"use client";

import { Question } from "@/lib/sheets";
import { Step } from "./step";
import { ROLLBACK_COUNT, ROLLBACK_POSITION, STEP_COUNT, boardConfig } from "./data";
import { QuestionHandle, Questions } from "./question";
import { Button } from "../ui/button";
import { ElementRef, RefObject, useEffect, useRef, useState } from "react";
import { Game } from "@/lib/game";
import { delay, dice } from "@/lib/utils";
import { Deck } from "@/lib/deck";
import { FiPlay } from "react-icons/fi";
import {
  BsFillDice1Fill,
  BsFillDice2Fill,
  BsFillDice3Fill,
  BsFillDice4Fill,
  BsFillDice5Fill,
  BsFillDice6Fill,
} from "react-icons/bs";
import { AlertHandle, Alerts } from "./alerts";

interface BoardProps {
  questions: Question[];
}

interface GameFactoryPayload {
  questions: Question[];
  questionsRef: RefObject<QuestionHandle>;
  alertsRef: RefObject<AlertHandle>;
  onFinished?: (reason: string) => void;
  onProgress?: (game: Game) => void;
}

export function createNewGame({ questions, questionsRef, alertsRef, onFinished, onProgress }: GameFactoryPayload) {
  const game = new Game(new Deck(...questions), {
    rollbackCount: ROLLBACK_COUNT,
    rollbackPosition: ROLLBACK_POSITION,
    timeline: STEP_COUNT,
    async onReachesRollbackPosition() {
      await alertsRef.current?.alert({
        title: "Que pena!",
        description: `Você chegou na ambulância! Volte ${ROLLBACK_COUNT} casas!`,
        type: "fail",
      });
    },
    async onAsk(question) {
      const answer = await questionsRef.current!.question(question);

      await alertsRef.current?.alert({
        title: answer.correct ? "Parabéns!" : "Que pena!",
        description: answer.correct ? "Você acertou a questão!" : "Você errou a questão!",
        type: answer.correct ? "success" : "fail",
      });

      return answer;
    },
    async onFinish(reason) {
      await alertsRef.current?.alert({
        title: "Parabéns!",
        description: "Você terminou o jogo!",
        type: "success",
      });

      onFinished?.(reason);
    },
  });

  onProgress && game.onProgress(onProgress);

  return game;
}

export function Board({ questions }: BoardProps) {
  const questionsRef = useRef<ElementRef<typeof Questions>>(null);
  const alertsRef = useRef<ElementRef<typeof Alerts>>(null);

  const [game, setGame] = useState<Game | null>(null);

  const [currentDice, setCurrentDice] = useState<number | null>(null);
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [waiting, setWaiting] = useState(false);

  async function move() {
    if (!game) return;

    setWaiting(true);
    let number = 0;
    for (let i = 0; i < 10; i++) {
      number = dice();
      setCurrentDice(number);
      await delay(50 + i * 50);
    }

    await game.next(number);
    setWaiting(false);
  }

  async function start() {
    const game = createNewGame({
      questions,
      questionsRef,
      alertsRef,
      onFinished(reason) {
        console.log(reason);
        setCurrentDice(null);
        setCurrentPosition(null);
        setGame(null);
      },
      onProgress(game) {
        console.log(game);
        setCurrentPosition(game.position);
      },
    });

    setGame(game);
  }

  const diceIcons = [
    BsFillDice1Fill,
    BsFillDice2Fill,
    BsFillDice3Fill,
    BsFillDice4Fill,
    BsFillDice5Fill,
    BsFillDice6Fill,
  ];

  const DiceButton = currentDice ? diceIcons[currentDice - 1] : FiPlay;

  return (
    <div className="flex items-center justify-center flex-col min-h-screen space-y-6">
      <div className="grid grid-cols-7 gap-3">
        {boardConfig.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            const key = `${rowIndex}-${cellIndex}`;
            if (!cell) return <div key={key}></div>;

            return <Step active={currentPosition === cell} key={key} cell={cell} />;
          })
        )}
      </div>

      <div className="flex space-x-3">
        {game ? (
          <DiceButton
            className="transition cursor-pointer hover:scale-110"
            size={36}
            onClick={() => !waiting && move()}
          />
        ) : (
          <Button size="lg" onClick={() => start()}>
            Começar
          </Button>
        )}
      </div>

      <Questions ref={questionsRef} />
      <Alerts ref={alertsRef} />
    </div>
  );
}
