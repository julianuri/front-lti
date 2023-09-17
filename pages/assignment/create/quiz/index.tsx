import QuizCreator from '../../../../src/components/GamesWorkShop/Creator/Quiz/QuizCreator';
import { useRouter } from 'next/router';

function CreateQuizPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  return <QuizCreator assignmentId={parseInt(assignmentId as string)}/>;
}

export default CreateQuizPage;
