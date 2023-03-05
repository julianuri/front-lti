import Layout from "../../src/components/Layout";
import { useRouter } from "next/router";

function RedirectPage() {
  const router = useRouter();

  return (
    <Layout>
      <h1>{router.query["user_id"]}</h1>
      <h1>{router.query["is_student"]}</h1>
      <h1>{router.query["is_instructor"]}</h1>
      <h1>{router.query["context_id"]}</h1>
      <h1>{router.query["context_type"]}</h1>
    </Layout>
  );
}

export default RedirectPage;
