import { useRouter } from 'next/router';
import { useEffect } from 'react';

function GamePage() {
	const router = useRouter();
	const { gameId } = router.query;

	useEffect(() => {
		// @ts-expect-error
		if (gameId == 1) {
			router.push({ pathname: '/game/quiz', query: { ...router.query } });
		}
		console.table(router.query);
	}, [router.isReady]);

	return (
		<>
		</>
	);
}

export default GamePage;
