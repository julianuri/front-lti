import MemoryCreator from '../../../../src/components/GamesWorkShop/Creator/Memory/MemoryCreator';
import { useRouter } from 'next/router';

function CreateMemoryPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  return <MemoryCreator assignmentId={parseInt(assignmentId as string)}/>;
}

export default CreateMemoryPage;
