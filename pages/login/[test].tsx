import { useRouter } from "next/router";

function Test() {
  const router = useRouter();

  console.log(router.query.test);
  return <h2>OMEGA</h2>;
}

export default Test;
