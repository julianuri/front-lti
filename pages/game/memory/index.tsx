import { useRouter } from 'next/router';
import Memory from '../../../src/components/Games/Memory/Memory';

function QuizPage() {
  const router = useRouter();
  const { assignmentId, gameId } = router.query;

  return <Memory assignmentId={parseInt(assignmentId as string)} gameId={parseInt(gameId as string)} />;
}

export default QuizPage;
