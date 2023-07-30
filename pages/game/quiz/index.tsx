import { useRouter } from 'next/router';
import Link from 'next/link';
import Board from '../../../src/components/Games/Quiz/Quiz';

function QuizPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  return (
    <>
      <Board
        assignmentId={parseInt(assignmentId as string)}
      />
    </>
  );
}

export default QuizPage;
