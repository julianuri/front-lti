import SnakeMaker from '../../../../src/components/GamesWorkShop/Creator/Snake/SnakeMaker';
import { useRouter } from 'next/router';

function CreateSnakesPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  return <SnakeMaker assignmentId={parseInt(assignmentId as string)}/>;
}

export default CreateSnakesPage;
