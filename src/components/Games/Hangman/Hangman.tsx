import HangmanDrawing from './HangmanDrawing/HangmanDrawing';
import Keyboard from './Keyboard/Keyboard';
import styles from './Hangman.module.scss';
import { useEffect, useRef, useState } from 'react';
import IBoardProps from '../../../types/props/IBoardProps';
import { getRun } from '../../../service/RunService';
import { setLTIScore } from '../../../service/ScoreService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

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

  useEffect(() => {
    const audio = new Audio('/static/audios/hangup.mp3');
    //void audio.play();
    if (dataFetchedRef.current) {
      const data = {
        assignmentId, userId: userId, gameId, order, hasWon
      };

      getRun(data).then(async (data) => {
        if (order < totalQuestions) {
          setGuessedLetters([getRandomLetter(data.game_data.info.word_to_guess)]);

          if (order != data.game_data.info.order) {
            setOrder(data.game_data.info.order);
          }

          setWord(data.game_data.info.word_to_guess);
          setTotalQuestions(data.totalQuestions);
          setClue(data.game_data.info.clue);
          setHasWon(null);
          setMistakes(0);
        } else if (order >= totalQuestions) {
          setLTIScore({assignmentId, userId, gameId, sessionId, launchId})
            .then((data) => {
              setScore(data.score);
            });
        }
      }).catch((error) =>
        toast.error(error.message));
    } else {
      dataFetchedRef.current = true;
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };

  }, [order]);

  const getRandomLetter = function(word: string): string {
    return word[Math.floor(Math.random() * word.length)];
  };

  const checkLetter = function(key: string): void {
    if (guessedLetters.includes(key)) return;

    setGuessedLetters((prev) => {
      const newGuessedLetters = [...prev, key];
      if (word.split('').every(letter => newGuessedLetters.includes(letter))) {
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

  const increaseOrder = function() {
    setTimeout(() => {
      setOrder(order + 1);
    }, 1500);
  };

  const wordToGuess = <div className={styles.wordToGuess}>{word.split('').map((l, index) => {

    if (hasWon != null) {
      return <div key={index} className={styles.letter}>
        <span className={guessedLetters.includes(l) ? styles.green : styles.red}>{l}</span>
      </div>;
    }

    return <div key={index} className={styles.letter}>
      <span className={guessedLetters.includes(l) ? styles.show : styles.doNotShow}>{l}</span>
    </div>;
  })}</div>;

  const hangmanBoard = <>
    <HangmanDrawing mistakes={mistakes} />
    {<div className={styles.clue}>{`Clue: ${clue}`}</div>}
    {wordToGuess}
    <div>{(hasWon) ? <div className={styles.green}>YOU WON</div> : null}</div>
    <div>{(hasWon === false) ? <div className={styles.red}>YOU LOST</div> : null}</div>
    <Keyboard checkLetter={checkLetter} isFinished={hasWon != null} />
  </>;

  return <div className={styles.hangmanContainer}>
    {score != null ? <div className={styles.scoreSection}>{score}/{totalQuestions} </div> : hangmanBoard}
  </div>
    ;
};

export default Hangman;
