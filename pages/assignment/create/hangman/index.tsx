import HangmanCreator from '../../../../src/components/GamesWorkShop/Creator/Hangman/HangmanCreator';
import { useRouter } from 'next/router';

function CreateHangManPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  return <HangmanCreator assignmentId={parseInt(assignmentId as string)}/>;
}

export default CreateHangManPage;
