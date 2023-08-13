interface IHangmanQuestion {
  id?: number,
  wordToGuess: string;
  order: number;
  clue: string;
}

export default IHangmanQuestion;
