import { Answer, Question } from "./sheets";
import { Deck } from "./deck";
import { delay } from "./utils";

interface GameConfig {
  timeline: number;
  rollbackPosition: number;
  rollbackCount: number;
  onAsk: (question: Question) => Promise<Answer>;
  onFinish: (reason: string) => Promise<void>;
  onReachesRollbackPosition: () => Promise<void>;
}

/**
 * The game consists in a time line of a timeline of 14 positions.
 * - The player rolls a dice and moves forward the number of positions.
 * - After moving, the player draws a card from the deck.
 * - The player answers the question on the card.
 * - If the answer is correct, the player rolls the dice again.
 * - If the answer is wrong, the player moves back 1 position as rolls the dice.
 * - If the player reaches the position 7 (the middle of the board), the player moves back 5 positions and rolls the dice.
 * - If the player reaches the position 14 (the end of the board), the player wins the game.
 */
export class Game {
  private listeners = new Map<string, (game: Game) => void>();

  position: number;
  finished: boolean;

  constructor(private deck: Deck<Question>, private config: GameConfig) {
    this.position = 0;
    this.finished = false;
  }

  async next(dice: number) {
    await this.moves(dice);

    if (this.position >= this.config.timeline) {
      await this.finish("Você venceu!");
      return;
    }

    const card = this.deck.draw();
    if (!card) {
      await this.finish("Você perdeu!");
      return;
    }

    const answer = await this.config.onAsk(card);

    if (answer.correct) {
      console.log("Resposta correta!");
      return;
    }

    this.moves(-1);
  }

  onProgress(listener: (game: Game) => void) {
    const id = Math.random().toString(36).substr(2, 9);

    this.listeners.set(id, listener);

    return () => this.listeners.delete(id);
  }

  private emitProgress() {
    for (const listener of this.listeners.values()) listener(this);
  }

  private async moves(count: number) {
    const times = Math.abs(count);

    for (let i = 0; i < times; i++) {
      if (count > 0) this.position++;
      if (count < 0) this.position--;

      this.emitProgress();
      await delay(250);
    }

    if (this.position === this.config.rollbackPosition) {
      await this.config.onReachesRollbackPosition();
      this.moves(-this.config.rollbackCount);
    }
  }

  async finish(reason: string) {
    this.finished = true;
    console.log(reason);
    await this.config.onFinish(reason);
  }
}
