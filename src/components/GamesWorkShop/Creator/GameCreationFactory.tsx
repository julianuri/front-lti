import GameEnum from '../../../types/enums/GameEnum';
import styles from './GenericCreator.module.scss';
import IHangmanQuestion from '../../../types/props/IHangmanQuestion';
import IQuizQuestion from '../../../types/props/IQuizQuestion';
import QuizForm from './Quiz/QuizForm';
import HangmanForm from './Hangman/HangmanForm';
import MemoryForm from './Memory/MemoryForm';
import IMemoryMatch from '../../../types/props/IMemoryMatch';

interface FactoryProp {
  id: number;
  gameId: number;
  item: IQuizQuestion | IHangmanQuestion | IMemoryMatch;
  deleteQuestion: (index: number) => void;
}


const buildItem = function(props: FactoryProp) {

  switch (props?.gameId) {
  case GameEnum.quiz:
    return (<>
      <div className={styles.card} key={(props?.item as IQuizQuestion).question}>
        {(props?.item as IQuizQuestion).question}<span
        className={styles.delete}
        onClick={() => props.deleteQuestion(props.id)}>X</span>
      </div>
    </>);
  case GameEnum.hangman:
    return (<>
      <div className={styles.card} key={(props?.item as IHangmanQuestion).wordToGuess}>
        {(props?.item as IHangmanQuestion).wordToGuess}<span
        className={styles.delete}
        onClick={() => props.deleteQuestion(props.id)}>X</span>
      </div>
    </>);
  case GameEnum.memory:
    return (<>
      <div className={styles.card} key={(props?.item as IMemoryMatch).firstMatch}>
        {(props?.item as IMemoryMatch).firstMatch}<span
        className={styles.delete}
        onClick={() => props.deleteQuestion(props.id)}>X</span>
      </div>
    </>);

  }
};


interface FactorySpecificForm {
  gameId: number;
  items: IQuizQuestion[] | IHangmanQuestion[] | IMemoryMatch[];
  setItems: (items: IQuizQuestion[] | IHangmanQuestion[] | IMemoryMatch[]) => void;
  setShowModal: (showModal: boolean) => void;
}

const getCustomGameForm = function(props: FactorySpecificForm) {
  switch (props.gameId) {
  case GameEnum.quiz:
    return <QuizForm items={(props.items as IQuizQuestion[])} setItems={props.setItems} setShowModal={props.setShowModal} />;
  case GameEnum.hangman:
    return <HangmanForm items={(props.items as IHangmanQuestion[])} setItems={props.setItems} setShowModal={props.setShowModal} />;
  case GameEnum.memory:
    return <MemoryForm items={(props.items as IMemoryMatch[])} setItems={props.setItems} setShowModal={props.setShowModal} />;
  }
};

export { buildItem, getCustomGameForm };
