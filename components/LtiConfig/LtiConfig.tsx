import { useState } from "react";
import SideBar from "../Common/SideBar";
import classes from "./LtiConfig.module.css";

const LtiConfig = () => {
  return (
    <div className={classes["lti-page"]}>
      <SideBar>
        <div>Courses</div>
        <div>Stats</div>
        <div>Config</div>
      </SideBar>
      <div className={classes["lti-config-section"]}>
        <ul className={classes.canvasConfig}>
          <li>Deployment ID: 123456789</li>
          <li>Launch URL: https://best-app-in-the-world.omega</li>
          <li>Login URL: hehe.net</li>
          <li>JWT URL: hoho.com</li>
        </ul>
      </div>
    </div>
  );
};

export default LtiConfig;
