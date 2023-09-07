import { useRouter } from 'next/router';
import Stats from '../../src/components/Stats/Stats';


function StatsPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  return (
    <>
      <Stats
        assignmentId={parseInt(assignmentId as string)}
      />
    </>
  );
}

export default StatsPage;
