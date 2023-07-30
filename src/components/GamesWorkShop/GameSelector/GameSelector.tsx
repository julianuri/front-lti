import classes from './GameSelector.module.scss';
import { useEffect, useRef, useState } from 'react';
import { getGames } from '../../../service/GameService';
import GameCard from './GameCard/GameCard';
import IGame from '../../../types/IGame';
import { useRouter } from 'next/router';
import { getAllQuestionBanks } from '../../../service/QuestionBankService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import gameEnum from '../../../types/enums/GameEnum';
import { notifications } from '@mantine/notifications';

const GameSelector = () => {

  const { userId } = useSelector((state: RootState) => state.auth);
  const [games, setGames] = useState<IGame[]>([]);
  const router = useRouter();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current || process.env.NODE_ENV !== 'development') {
      Promise.all([getGames(), getAllQuestionBanks(userId)])
        .then(([gamesRS, questionBanksRS]) => {
          if (questionBanksRS.data.length === 0) {
            const newGames = gamesRS.data.filter((game: IGame) => game.id !== gameEnum.quiz && game.id !== gameEnum.snake);
            setGames(newGames);
            notifications.show({
              message: 'Agrega un banco de preguntas para crear tareas con los juegos de "Quiz" y "Serpientes y Escaleras"',
              autoClose: 10000,
            });
          } else {
            setGames(gamesRS.data);
          }
        })
        .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
    }
    return () => {
      effectRan.current = true;
    };
  }, []);


  return (
    <div className={classes.container}>
      <div className={classes.cardsContainer}>
        {games.map((game: IGame) => {
          return (
            <GameCard
              key={game.id}
              id={game.id}
              name={game.name}
              setGame={() => void router.replace(`/assignment/create/${game.name}`)}
              svgImage={game.svgRoute}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GameSelector;
