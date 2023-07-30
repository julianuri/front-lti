import { useRouter } from 'next/router';
import Link from 'next/link';
import Hangman from '../../../src/components/Games/Hangman/Hangman';

function QuizPage() {
  const router = useRouter();
  const { assignmentId, gameId } = router.query;

  return (
    <>
      <Hangman
        assignmentId={parseInt(assignmentId as string)}
        gameId={parseInt(gameId as string)}
      />
      <Link href="/student/assignments">back</Link>
    </>
  );
}

export default QuizPage;
