import Layout from '../../../src/components/Layout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import Board from '../../../src/components/Games/Quiz/Quiz';

function QuizPage() {
	const router = useRouter();
	const { assignmentId, gameId } = router.query;

	useEffect(() => {
		console.table(router.query);
	}, [router.isReady]);

	return (
		<Layout>
			<Board assignmentId={parseInt(assignmentId as string)} gameId={parseInt(gameId as string)}/>
			<Link href='/student'>back</Link>
		</Layout>
	);
}

export default QuizPage;
