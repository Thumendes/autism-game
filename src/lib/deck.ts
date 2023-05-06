export class Deck<T> {
  cards: T[];

  constructor(...items: T[]) {
    this.cards = items;
  }

  addCard(card: T) {
    this.cards.push(card);
  }

  shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  draw() {
    return this.cards.pop();
  }
}
