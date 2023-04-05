import IHangmanQuestion from './IHangmanQuestion';

interface HangmanFormProps {
  words: IHangmanQuestion[]
  setWords: (words: IHangmanQuestion[]) => void
  setShowModal: (showModal: boolean) => void
}

export default HangmanFormProps;
