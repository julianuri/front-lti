import { useRouter } from 'next/router';
import { useEffect } from 'react';
import GameEnumId from '../../src/types/enums/GameEnum';

function GamePage() {

  const router = useRouter();
  const { gameId } = router.query;

  useEffect(() => {
    switch (parseInt(gameId as string)) {
			case GameEnumId.quiz:
				void router.push({ pathname: '/game/quiz', query: { ...router.query } });
				break;
			case GameEnumId.hangman:
        void router.push({ pathname: '/game/hangman', query: { ...router.query } });
        break;
    }

  }, [router.isReady]);

}

export default GamePage;
