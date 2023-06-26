import toast from 'react-hot-toast';
import classes from './GameSelector.module.scss';
import { useEffect, useState } from 'react';
import { getGames } from '../../../service/GameService';
import GameCard from './GameCard/GameCard';
import Link from 'next/link';
import styles from '../Creator/GenericCreator.module.scss';
import IGame from '../../../types/IGame';
import GenericCreator from '../Creator/GenericCreator';
import GameEnum from '../../../types/enums/GameEnum';
import SnakeMaker from '../Creator/Snake/SnakeMaker';
import MemoryCreator from '../Creator/Memory/MemoryCreator';

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
      <div className={classes.cardsContainer}>
        {games.map((game: IGame) => {
          return (
            <GameCard key={game.id} id={game.id} name={game.name} setGame={setSelectedGame} svgImage={game.svgRoute} />
          );
        })}
      </div>
      <Link className={styles.button} href='/instructor'>Back</Link>
    </div>
  );

  return (
    <>
      {selectedGame.id != 0 && (selectedGame.id == GameEnum.quiz || selectedGame.id == GameEnum.hangman) ? <GenericCreator gameId={selectedGame.id} /> : null}
      {selectedGame.id == GameEnum.memory ? <MemoryCreator gameId={selectedGame.id} /> : null}
      {selectedGame.id == GameEnum.snake ? <SnakeMaker gameId={selectedGame.id} /> : null}
      {(selectedGame.id == 0)
        ? gameSelector
        : <button className={styles.button} onClick={() => setSelectedGame({ name: '', id: 0 })}>Back</button>}
    </>
  );
};

export default GameSelector;
