import { Fragment } from "react";
import RegisterForm from "../../src/components/Register/Register";
import Link from "next/link";

function HomePage() {
  return (
    <Fragment>
      <RegisterForm />
      <h2>
        <Link href={"/"}>Login Page</Link>
      </h2>
    </Fragment>
  );
}

export default HomePage;
