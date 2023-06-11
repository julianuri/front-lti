import styles from './SnakeCard.module.scss';
import ISnakeQuestion from '../../../../types/props/ISnakeQuestion';

interface SnakeCardInterface {
  question: ISnakeQuestion;
  handleAnswerOptionClick: (id: number, message: number) => void;
}


const SnakeCard = (props: SnakeCardInterface) => {

  return <div className={styles.card}>
    <div>
      <div className={styles.questionSection}>
        <div className={styles.questionText}>{props.question.question}</div>
      </div>
      <div className={styles.answerSection}>
        {props.question.options?.map((answerOption: { option: string }, index) => (
          <button
            className={styles.button} key={answerOption.option}
            onClick={() => props.handleAnswerOptionClick(props.question.id, index)}
          >{answerOption.option}
          </button>
        ))}
      </div>
    </div>
  </div>;
};

export default SnakeCard;
