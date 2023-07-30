import { useRouter } from 'next/router';
import Link from 'next/link';
import Memory from '../../../src/components/Games/Memory/Memory';

function QuizPage() {
  const router = useRouter();
  const { assignmentId, gameId } = router.query;

  return (
    <>
      <Memory
        assignmentId={parseInt(assignmentId as string)}
        gameId={parseInt(gameId as string)}
      />
      <Link href="/student/assignments">back</Link>
    </>
  );
}

export default QuizPage;
