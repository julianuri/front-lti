import { useRouter } from 'next/router';
import Board from '../../../src/components/Games/Quiz/Quiz';

function QuizPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  return <Board assignmentId={parseInt(assignmentId as string)} />;
}

export default QuizPage;
