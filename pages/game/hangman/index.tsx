import { useRouter } from 'next/router';
import Hangman from '../../../src/components/Games/Hangman/Hangman';

function QuizPage() {
  const router = useRouter();
  const { assignmentId, gameId } = router.query;

  return (
      <Hangman
        assignmentId={parseInt(assignmentId as string)}
        gameId={parseInt(gameId as string)}
      />
  );
}

export default QuizPage;
