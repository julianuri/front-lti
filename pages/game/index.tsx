import { useRouter } from 'next/router';
import { useEffect } from 'react';
import GameEnum from '../../src/types/enums/GameEnum';

function GamePage() {
  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
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
      case GameEnum.snake:
        void router.push({
          pathname: '/game/snake',
          query: { ...router.query },
        });
        break;
    }
  }, [router.isReady]);
}

export default GamePage;
