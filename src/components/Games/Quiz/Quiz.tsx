import { useEffect, useRef, useState } from 'react';
import Card from './Card/Card';
import styles from './Quiz.module.scss';
import ICard from '../../../types/ICard';
import { getRun } from '../../../service/RunService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { setLTIScore } from '../../../service/ScoreService';

const Board = ({ assignmentId, gameId }) => {

	const { userId } = useSelector((state) => state.auth);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
	const [answers, setAnswers] = useState<number[]>([]);
	const [question, setQuestion] = useState<ICard>({question: '', options: []});
	const [totalQuestions, setTotalQuestions] = useState(999);
	const dataFetchedRef = useRef(false);

	useEffect(() => {
		if (dataFetchedRef.current) {
			getRun(assignmentId, userId, gameId, currentQuestion, answers[currentQuestion - 1]).then(async (data) => {
				if (currentQuestion < totalQuestions) {
					setAnswers(data.answers);

					if (currentQuestion != data.game_data.order) {
						setCurrentQuestion(data.game_data.order);
					}

					setQuestion({
						question: data.game_data.question,
						options: data.game_data.answers
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
