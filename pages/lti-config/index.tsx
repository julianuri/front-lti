import { Fragment } from "react";
import LtiConfig from "../../components/LtiConfig/LtiConfig";
import Link from "next/link";

function LtiConfigPage() {
  return (
    <Fragment>
      <LtiConfig />
      <h2>
        <Link href={"/login"}>Login Page</Link>
      </h2>
    </Fragment>
  );
}

export default LtiConfigPage;
