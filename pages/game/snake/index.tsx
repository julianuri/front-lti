import Layout from '../../../src/components/Layout';
import { useRouter } from 'next/router';
import Snakes from '../../../src/components/Games/Snakes/Snakes';
import Link from 'next/link';

function SnakesPage() {
	const router = useRouter();
	const { assignmentId, gameId } = router.query;

	return (
		<Layout>
			<Snakes assignmentId={parseInt(assignmentId as string)} gameId={parseInt(gameId as string)}/>
		</Layout>
	);
}

export default SnakesPage;
