import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import GameEnum from '../../src/types/enums/GameEnum';
import IGame from '../../src/types/IGame';
import GameCard from '../../src/components/GamesWorkShop/Creator/GameCard/GameCard';
import { getGame } from '../../src/service/GameService';
import { notifications } from '@mantine/notifications';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/redux/store';
import { Carousel } from '@mantine/carousel';
import Image from 'next/image';
import classes from '../../src/components/GamesWorkShop/Creator/GameCard/GameCard.module.scss';
import GamesNames from '../../src/types/consts/GamesNames';
import { Button, Divider, Modal, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

function GamePage() {
  const router = useRouter();
  const { gameId } = router.query;
  const [opened, { open, close }] = useDisclosure(true);
  const [game, setGame] = useState<IGame>({
    name: '',
    description: '',
    id: 0,
    instructions: '',
    svgRoute: '',
  });

  useEffect(() => {

    getGame(gameId as unknown as number)
      .then((gamesRS) => {
        setGame({...gamesRS.data});
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red' }));

  }, []);

  const sendToAssignment = function() {
    switch (parseInt(gameId as string)) {
    case GameEnum.quiz:
      void router.push({
        pathname: '/game/quiz',
        query: { ...router.query },
      });
      break;
    case GameEnum.hangman:
      void router.push({
        pathname: '/game/hangman',
        query: { ...router.query },
      });
      break;
    case GameEnum.memory:
      void router.push({
        pathname: '/game/memory',
        query: { ...router.query },
      });
      break;
    case GameEnum.snakes:
      void router.push({
        pathname: '/game/snake',
        query: { ...router.query },
      });
      break;
    }
  };


  return <>
    {(game.id !== 0 && opened) ?
      <Paper styles={{ title: { color: '#228be6', fontWeight: 'bold' } }}
             style={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               gap: '1rem',
               minHeight: '100%',
               padding: '1rem'
             }}>

        <Image src={game.svgRoute} alt={game.name} width={120} height={120} />
        <div className={classes['title']}>&nbsp;{GamesNames[game.name]}</div>
        <div style={{ textAlign: 'center', margin: '0 3rem' }}>{renderParagraph(game.instructions)}</div>
        <Button onClick={sendToAssignment}>Continuar</Button>

      </Paper>
      : null}</>;
}

export default GamePage;

function renderParagraph(paragraph: string) {

  const [firstLine, ...rest] = paragraph.split('\n');
  return (
    <p>
      {firstLine}
      {rest.map(line => {
        return <Fragment key={line}>
          <br />
          {line}
        </Fragment>;
      })}
    </p>
  );
}
