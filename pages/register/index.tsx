import { Fragment } from "react";
import RegisterForm from "../../components/Register/Register";
import Link from "next/link";

function HomePage() {
  return (
    <Fragment>
      <RegisterForm />
      <h2>
        <Link href={"/login"}>Login Page</Link>
      </h2>
    </Fragment>
  );
}

export default HomePage;
