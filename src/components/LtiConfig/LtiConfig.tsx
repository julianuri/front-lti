import { useState } from 'react';
import SideBar from '../Common/SideBar';
import classes from './LtiConfig.module.scss';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import LtiTab from './LtiTab/LtiTab';
import {useSelector} from "react-redux";

const LtiConfig = () => {
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const [configInputs, setConfigInputs] = useState([{ value: '', inputName: '' }]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
    fetch(`https://localhost:9001/api/user-config`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })
      .then((response) => response.json())
      .then((data) => {
        let next = tabs.indexOf(activeWindow);
        setActiveWindow(tabs[next + 1]);
        setFields(data);

        setConfigInputs([
          { value: data['OIDC Redirect URL'], inputName: 'oidc' },
          {
            value: data['OpenID Connect Initiation Url'],
            inputName: 'openid',
          },
          {
            value: data['domain'],
            inputName: 'domain',
          },
          {
            value: data['JWK URL'],
            inputName: 'jwk',
          },
        ]);
        console.log(configInputs);
        console.log(data);
      });
  };
  const [activeWindow, setActiveWindow] = useState('Basics');
  const [fields, setFields] = useState({
    domain: '',
    'OIDC Redirect URL': '',
    'OpenID Connect Initiation Url': '',
    'JWK URL': '',
  });

  const tabs = ['Basics', 'Configuration', 'Registration', 'LTI Advantage'];

  return (
    <div className={classes.lti_page}>
      <SideBar>
        <div>Courses</div>
        <div>Stats</div>
        <div>Config</div>
        <div>{`El usuario inició sesión: ${isLoggedIn}`}</div>
        <Link href={'/'}>Login Page</Link>
      </SideBar>

      <div className={classes.lti_config_section}>
        <ul className={classes.lti_tabs}>
          {tabs.map((tab) => {
            return (
              <li key={tab} id={tab} className={activeWindow === tab ? classes.active : undefined}>
                {tab}
              </li>
            );
          })}
        </ul>
        {activeWindow === 'Basics' ? (
          <form onSubmit={handleSubmit(onSubmit)} className={classes.canvas_form}>
            <input
              placeholder="LTI 1.3 Connection Name"
              className={errors.appName ? classes['invalid'] : undefined}
              {...register('appName', { required: true })}
            />
            {errors.appName && <span>This field is required</span>}
            <input value="Next" type="submit" />
          </form>
        ) : null}

        {activeWindow === 'Configuration' ? (
          <form onSubmit={handleSubmit(onSubmit)} className={classes.canvas_form}>
            <LtiTab fields={configInputs} register={register} />
            <input value="Next" type="submit" />
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default LtiConfig;
