import ICard from '../../../../types/ICard';
import LoadingSpinner from '../../../Common/Spinner/Spinner';
import styles from './Card.module.scss';

interface CardProps {
  currentQuestion: ICard
  handleAnswerOptionClick: (message: number) => void
  totalQuestions: number
  questionOrder: number
}

export default function Card (props: CardProps) {
	const showCard = (props.currentQuestion !== undefined);
	return (

		<div>
			{(showCard)

				? (<div>
					<div className={styles.questionSection}>
						<div className={styles.questionCount}>
							<span>Question {props.questionOrder + 1}</span>/{props.totalQuestions}
						</div>
						<div className={styles.questionText}>{props.currentQuestion.question}</div>
					</div>
					<div className={styles.answerSection}>
						{props.currentQuestion.options.map((answerOption: { option: string }, index) => (
							<button
								className={styles.button} key={answerOption.option}
								onClick={() => props.handleAnswerOptionClick(index)}
							>{answerOption.option}
							</button>
						))}
					</div>
				</div>)
				: (<LoadingSpinner />)}
		</div>
	);
}
