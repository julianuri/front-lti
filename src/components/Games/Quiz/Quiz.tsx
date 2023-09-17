import { useEffect, useRef, useState } from 'react';
import Card from './Card/Card';
import styles from './Quiz.module.scss';
import ICard from '../../../types/ICard';
import { getRun } from '../../../service/RunService';

import { useDispatch, useSelector } from 'react-redux';
import { setLTIScore } from '../../../service/ScoreService';
import IBoardProps from '../../../types/props/IBoardProps';
import { assignmentSliceActions, RootState } from '../../../redux/store';
import QuestionTypeEnum from '../../../types/enums/QuestionTypeEnum';
import gameEnum from '../../../types/enums/GameEnum';
import { Paper, Rating } from '@mantine/core';
import { notifications } from '@mantine/notifications';

const Board = ({ assignmentId }: IBoardProps) => {

	const { userId, sessionId, launchId } = useSelector((state: RootState) => state.auth);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [showScore, setShowScore] = useState(false);
	const [score, setScore] = useState(0);
	const [answers, setAnswers] = useState<number[]>([]);
	const [question, setQuestion] = useState<ICard>({
    question: '',
    options: [],
    type: QuestionTypeEnum.SIMPLE
  });
	const [totalQuestions, setTotalQuestions] = useState(999);
	const dataFetchedRef = useRef(false);
  const [stars, setStars] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if ((dataFetchedRef.current || process.env.NODE_ENV !== 'development') && assignmentId !== undefined) {
      const data = {
        assignmentId,
        userId: userId,
        gameId: gameEnum.quiz,
        order: currentQuestion,
        answerIndex: answers[currentQuestion - 1],
      };

      getRun(data)
        .then(async (data) => {
          if (currentQuestion < totalQuestions) {
            setAnswers(data.answers);

            if (currentQuestion != data.game_data.info.order) {
              setCurrentQuestion(data.game_data.info.order);
            }

            setQuestion({
              question: data.game_data.info.question,
              options: data.game_data.info.options,
              type: data.game_data.info.type,
            });

					setTotalQuestions(data.totalQuestions);
				} else if (currentQuestion >= totalQuestions) {
					setLTIScore({assignmentId, userId, gameId: gameEnum.quiz, sessionId, launchId}).then(
            (data) => {
							setScore(data.score);
							setShowScore(true);
              setStars(data.score/20);
              dispatch(assignmentSliceActions.saveLaunchedAssignment({
                launchedAssignmentId: 0,
                launchedGameId: 0
              }));
						}
          );
				}
			}).catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
		}
    return () => {
      dataFetchedRef.current = true;
    };
	}, [currentQuestion]);

  const handleAnswerOptionClick = (chosenAnswerIndex: any) => {
    setAnswers([...answers, chosenAnswerIndex]);
    const nextQuestion = currentQuestion + 1;
    setCurrentQuestion(nextQuestion);
  };

  return (
    <Paper styles={{
      title: { color: '#228be6', fontWeight: 'bold' }
    }}
           style={{
             display: 'flex',
             minHeight: '100%',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '1rem',
             padding: '1rem'
           }}>


        {showScore ? (

            <div className={styles.scoreSection}>
              <div> Conseguiste {score} de {100}</div>
              <Rating fractions={10} value={stars} readOnly />
            </div>

        ) : (
          <Card
            currentQuestion={question}
            totalQuestions={totalQuestions}
            questionOrder={currentQuestion}
            handleQuizAnswer={handleAnswerOptionClick}
          />
        )}


    </Paper>
  );
};

export default Board;
