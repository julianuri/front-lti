import { useState } from "react";
import SideBar from "../Common/SideBar";
import classes from "./LtiConfig.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import LtiTab from "./LtiTab/LtiTab";

const LtiConfig = () => {
  const [configInputs, setConfigInputs] = useState([{ value: "", inputName: "" }]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    fetch(`http://localhost:9001/api/user-config`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    })
      .then((response) => response.json())
      .then((data) => {
        setActiveWindow("Configuration");
        setFields(data);

        setConfigInputs([
          { value: data["OIDC Redirect URL"], inputName: "oidc" },
          {
            value: data["OpenID Connect Initiation Url"],
            inputName: "openid",
          },
          {
            value: data["domain"],
            inputName: "domain",
          },
          {
            value: data["JWK URL"],
            inputName: "jwk",
          },
        ]);
        console.log(configInputs);
        console.log(data);
      });
  };
  const [activeWindow, setActiveWindow] = useState("Basics");
  const [fields, setFields] = useState({
    domain: "",
    "OIDC Redirect URL": "",
    "OpenID Connect Initiation Url": "",
    "JWK URL": "",
  });

  /*<li id="basics" onClick={handleClick}  className={activeWindow === id ? "active" : undefined}>
            Basics
          </li>
          <li id="config" onClick={handleClick}>
            Configuration
          </li>
          <li id="regis" onClick={handleClick}>
            Registration
          </li>
          <li id="lti" onClick={handleClick}>
            LTI Advantage
          </li>*/
  const tabs = ["Basics", "Configuration", "Registration", "LTI Advantage"];

  const handleClick = (event: any) => {
    console.log(event);
    // 👇️ toggle class on click
    //event.target.className = classes["active"];
    //event.preventDefault();
    setActiveWindow(event.target.id);
    // 👇️ add class on click
    // event.currentTarget.classList.add('bg-salmon');

    // 👇️ remove class on click
    // event.currentTarget.classList.remove('bg-salmon');
  };

  return (
    <div className={classes["lti-page"]}>
      <SideBar>
        <div>Courses</div>
        <div>Stats</div>
        <div>Config</div>
        <Link href={"/login"}>Login Page</Link>
      </SideBar>

      <div className={classes["lti-config-section"]}>
        <ul className={classes["lti-tabs"]}>
          {tabs.map((tab) => {
            return (
              <li
                key={tab}
                id={tab}
                //onClick={handleClick}
                className={activeWindow === tab ? classes["active"] : undefined}
              >
                {tab}
              </li>
            );
          })}
        </ul>
        {activeWindow === "Basics" ? (
          <form onSubmit={handleSubmit(onSubmit)} className={classes.canvasForm}>
            {/* register your input into the hook by invoking the "register" function */}
            <input
              placeholder="LTI 1.3 Connection Name"
              className={errors.appName ? classes["invalid"] : undefined}
              {...register("appName", { required: true })}
            />
            {errors.appName && <span>This field is required</span>}
            {/* include validation with required or other standard HTML validation rules */}
            {/*<input {...register("lauch", { required: true })} disabled /> *}
            {/* errors will return when field validation fails  */}
            {/*errors.exampleRequired && <span>This field is required</span>*/}

            <input value="Next" type="submit" />
          </form>
        ) : null}

        {activeWindow === "Configuration" ? (
          <form onSubmit={handleSubmit(onSubmit)} className={classes.canvasForm}>
            <LtiTab fields={configInputs} register={register} />

            <input value="Next" type="submit" />
          </form>
        ) : null}
        {/*
        <ul className={classes.canvasConfig}>
          <li>Deployment ID: 123456789</li>
          <li>Launch URL: https://best-app-in-the-world.omega</li>
          <li>Login URL: hehe.net</li>
          <li>JWT URL: hoho.com</li>
        </ul>
  */}
      </div>
    </div>
  );
};

export default LtiConfig;
