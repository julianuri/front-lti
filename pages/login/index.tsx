import { Fragment } from "react";
import LoginForm from "../../components/Login/Login";
import Link from "next/link";

function HomePage() {
  return (
    <Fragment>
      <LoginForm />
      <h2>
        <Link href={"/login/fume"}>Link</Link>
      </h2>
      <h2>
        <Link href={"/lti-config"}>lti-config</Link>
      </h2>
    </Fragment>
  );
}

export default HomePage;
