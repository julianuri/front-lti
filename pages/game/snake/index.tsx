import { useRouter } from 'next/router';
import Snakes from '../../../src/components/Games/Snakes/Snakes';

function SnakesPage() {
  const router = useRouter();
  const { assignmentId, gameId } = router.query;

  return (
    <Snakes
      assignmentId={parseInt(assignmentId as string)}
      gameId={parseInt(gameId as string)}
    />
  );
}

export default SnakesPage;
