import HangmanDrawing from './HangmanDrawing/HangmanDrawing';
import Keyboard from './Keyboard/Keyboard';
import styles from './Hangman.module.scss';
import { useEffect, useRef, useState } from 'react';
import IBoardProps from '../../../types/props/IBoardProps';
import { getRun } from '../../../service/RunService';
import { setLTIScore } from '../../../service/ScoreService';
import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../../redux/store';
import { notifications } from '@mantine/notifications';
import { Paper, Rating } from '@mantine/core';

const Hangman = ({ assignmentId, gameId }: IBoardProps) => {
  const BODY_PARTS = 5;
  const { userId, sessionId, launchId } = useSelector((state: RootState) => state.auth);
  const [word, setWord] = useState<string>('');
  const [order, setOrder] = useState<number>(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(999);
  const [clue, setClue] = useState<string>('');
  const [score, setScore] = useState<number | null>(null);
  const dataFetchedRef = useRef(false);
  const [clickedLetters, setClickedLetters] = useState([]);
  const [stars, setStars] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const audio = new Audio('/static/audios/hangup.mp3');
    //void audio.play();
    if (dataFetchedRef.current || process.env.NODE_ENV !== 'development') {
      const data = {
        assignmentId,
        userId: userId,
        gameId,
        order,
        hasWon,
        clickedLetters,
      };

      getRun(data)
        .then(async (data) => {
          if (order < totalQuestions) {
            //YOU CAN CHEAT THE GAME IF THE GUESSED LETTER ALWAYS CHANGES WHEN EXITING AND REENTERING
            //setGuessedLetters([getRandomLetter(data.game_data.info.word_to_guess)]);

            if (order != data.game_data.info.order) {
              setOrder(data.game_data.info.order);
            }

            if (data.run.user_input.clickedLetters.length > clickedLetters.length) {
              setClickedLetters([...data.run.user_input.clickedLetters]);
            }

            let alreadyGuessedLetters: string[] = [];
            data.game_data.info.word_to_guess.split('').forEach((letter: string) => {
              if (data.run.user_input.clickedLetters.includes(letter)) {
                alreadyGuessedLetters = [...alreadyGuessedLetters, letter];
                data.run.user_input.clickedLetters.splice(
                  data.run.user_input.clickedLetters.findIndex(clickedLetter => clickedLetter === letter), 1);
              }
            });

            if (alreadyGuessedLetters.length > 0) {
              setGuessedLetters([...alreadyGuessedLetters]);
            }

            setWord(data.game_data.info.word_to_guess);
            setTotalQuestions(data.totalQuestions);
            setClue(data.game_data.info.clue);
            if (data.run.user_input.clickedLetters.length === 0 && alreadyGuessedLetters.length === 0) {
              setHasWon(null);
              setGuessedLetters([]);

              if (clickedLetters.length > 0) {
                setClickedLetters([]);
              }
            }

            setMistakes(data.run.user_input.clickedLetters.length);
        } else if (order >= totalQuestions) {
          setLTIScore({assignmentId, userId, gameId, sessionId, launchId})
            .then((data) => {
              setScore(data.score);
              setStars(data.score/20);
              dispatch(assignmentSliceActions.saveLaunchedAssignment({
                launchedAssignmentId: 0,
                launchedGameId: 0
              }));
            });
          }
        })
        .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
      dataFetchedRef.current = true;
    };
  }, [order, clickedLetters]);

  const getRandomLetter = function (word: string): string {
    return word[Math.floor(Math.random() * word.length)];
  };

  const checkLetter = function (key: string): void {
    if (guessedLetters.includes(key)) return;
    console.table(clickedLetters);
    setClickedLetters((prev) => [...prev, key]);

    setGuessedLetters((prev) => {
      const newGuessedLetters = [...prev, key];
      if (
        word.split('').every((letter) => newGuessedLetters.includes(letter))
      ) {
        setHasWon(true);
        void new Audio('/static/audios/won.mp3').play();
        increaseOrder();
      }
      return newGuessedLetters;
    });

    if (!word.split('').includes(key)) {
      setMistakes((prev) => {
        if (prev + 1 > BODY_PARTS) {
          const audio = new Audio('/static/audios/lose.mp3');
          audio.volume = 0.1;
          setHasWon(false);
          void audio.play();
          increaseOrder();
        }
        return prev + 1;
      });
    }
  };

  const increaseOrder = function () {
    setTimeout(() => {
      setOrder(order + 1);
    }, 1500);
  };

  const wordToGuess = (
    <div className={styles.wordToGuess}>
      {word.split('').map((l, index) => {
        if (hasWon != null) {
          return (
            <div key={index} className={styles.letter}>
              <span
                className={
                  guessedLetters.includes(l) ? styles.green : styles.red
                }
              >
                {l}
              </span>
            </div>
          );
        }

        return (
          <div key={index} className={styles.letter}>
            <span
              className={
                guessedLetters.includes(l) ? styles.show : styles.doNotShow
              }
            >
              {l}
            </span>
          </div>
        );
      })}
    </div>
  );

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

      {score != null ? (

        <div className={styles.scoreSection}>
          <div> Conseguiste {score} de {100}</div>
          <Rating fractions={10} value={stars} readOnly />
        </div>

      ) :  <>
        <HangmanDrawing mistakes={mistakes} />
        <div className={styles.clue}>{clue}</div>
        {wordToGuess}
        <Keyboard checkLetter={checkLetter} clickedLetters={clickedLetters} isFinished={hasWon != null} />
      </>}
    </Paper>
  );
};

export default Hangman;
