import toast from 'react-hot-toast';
import classes from './GameSelector.module.scss';
import { useEffect, useState } from 'react';
import { getGames } from '../../../service/GameService';
import GameCard from './GameCard/GameCard';
import Link from 'next/link';
import QuizCreator from '../Creator/Quiz/QuizCreator';
import styles from '../Creator/Quiz/QuizCreator.module.scss';
import IGame from '../../../types/IGame';
import GameEnum from '../../../types/enums/GameEnum';
import HangmanCreator from '../Creator/Hangman/HangmanCreator';

interface ISelectedGame {
  id: number
  name: string
}

const GameSelector = () => {

  const [games, setGames] = useState<IGame[]>([]);
  const [selectedGame, setSelectedGame] = useState<ISelectedGame>({ name: '', id: 0 });

  useEffect(() => {
    getGames().then(async (response) => {
      setGames(response.data);
    }).catch((error) =>
      toast.error(error.message)
    );
  }, []);

  const gameSelector = (
    <div className={classes.container}>
      <div>Choose game:</div>
      <div className={classes.cardsContainer}>
        {games.map((game: IGame) => {
          return (
            <GameCard key={game.id} id={game.id} name={game.name} setGame={setSelectedGame} />
          );
        })}
      </div>
      <Link className={styles.button} href='/instructor'>Back</Link>
    </div>
  );

  return (
    <>
      {(selectedGame.id == GameEnum.quiz) ? <QuizCreator gameId={selectedGame.id} /> : null}
      {(selectedGame.id == GameEnum.hangman) ? <HangmanCreator gameId={selectedGame.id}/> : null}
      {(selectedGame.name == '')
        ? gameSelector
        : <button className={styles.button} onClick={() => setSelectedGame({ name: '', id: 0 })}>Back</button>}
    </>
  );
};

export default GameSelector;
