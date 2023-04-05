import { useEffect, useRef, useState } from 'react';
import Card from './Card/Card';
import styles from './Quiz.module.scss';
import ICard from '../../../types/ICard';
import { getRun } from '../../../service/RunService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { setLTIScore } from '../../../service/ScoreService';
import IBoardProps from '../../../types/props/IBoardProps';
import { RootState } from '../../../redux/store';

const Board = ({ assignmentId, gameId }: IBoardProps) => {

	const { userId } = useSelector((state: RootState) => state.auth);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
	const [answers, setAnswers] = useState<number[]>([]);
	const [question, setQuestion] = useState<ICard>({question: '', options: []});
	const [totalQuestions, setTotalQuestions] = useState(999);
	const dataFetchedRef = useRef(false);

	useEffect(() => {
		console.log('rendering');
		if (!dataFetchedRef.current) {
			const data = {
				assignmentId, userId: userId, gameId, order: currentQuestion, answerIndex: answers[currentQuestion - 1]
			};

			getRun(data).then(async (data) => {
				if (currentQuestion < totalQuestions) {
					setAnswers(data.answers);

					if (currentQuestion != data.game_data.info.order) {
						setCurrentQuestion(data.game_data.info.order);
					}

					setQuestion({
						question: data.game_data.info.question,
						options: data.game_data.info.options
					});

					setTotalQuestions(data.totalQuestions);
				} else if (currentQuestion >= totalQuestions) {
					setLTIScore(assignmentId, userId, gameId)
						.then((data) => {
							setScore(data.score);
							setShowScore(true);
						});
				}
			}).catch((error) =>
				toast.error(error.message));
		} else {
			dataFetchedRef.current = true;
		}
	}, [currentQuestion]);

	const handleAnswerOptionClick = (chosenAnswerIndex: number) => {

		setAnswers([...answers, chosenAnswerIndex]);
		const nextQuestion = currentQuestion + 1;
		setCurrentQuestion(nextQuestion);
	};

	return (
		<div className={styles.board}>
			<div className={styles.question}>
				{showScore
					? (
						<div className={styles.scoreSection}>
							You scored {score} out of {totalQuestions}
						</div>
					)
					: (<Card
						currentQuestion={question}
						totalQuestions={totalQuestions}
						questionOrder={currentQuestion}
						handleAnswerOptionClick={handleAnswerOptionClick}
					/>)}
			</div>
		</div>
	);
};

export default Board;
