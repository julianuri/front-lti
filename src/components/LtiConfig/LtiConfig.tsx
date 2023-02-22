import { useEffect, useState } from 'react';
import classes from './LtiConfig.module.scss';
import { useForm } from 'react-hook-form';
import LtiTab from './LtiTab/LtiTab';
import { getAdminConfig, updateAdminConfig } from '../../service/AdminConfigService';
import { useSelector } from 'react-redux';
import { authState } from '../../features/auth/authSlice';
import AdminConfig from '../../types/AdminConfig';

const LtiConfig = () => {

  const { userId } = useSelector((state) => state.auth);

  const [configInputs, setConfigInputs] = useState([
    {
      value: '',
      inputName: '',
      isReadOnly: false
    }]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    console.log(userId);
    if (userId != 0) {
      getAdminConfig(userId).then((res: any) => {
        const data: authState = res;
        console.log(res);
        let arr = [
          { value: res['redirect_uri'], inputName: 'oidc', isReadOnly: true },
          {
            value: res['openid_url'] + 'la',
            inputName: 'openid',
            isReadOnly: true,
          },
          {
            value: res['target_uri'],
            inputName: 'target_uri',
            isReadOnly: true,
          },
          {
            value: res['public_jwk'],
            inputName: 'jwk',
            isReadOnly: true,
          },
          {
            value: res['client_id'],
            inputName: 'client_id',
            isReadOnly: false,
          },
          {
            value: res['oidc_issuer'],
            inputName: 'oidc_issuer',
            isReadOnly: false,
          },
          {
            value: res['auth_login_url'],
            inputName: 'auth_login_url',
            isReadOnly: false,
          },
          {
            value: res['public_key_url'],
            inputName: 'public_key_url',
            isReadOnly: false,
          },
          {
            value: res['auth_token_url'],
            inputName: 'auth_token_url',
            isReadOnly: false,
          },
          {
            value: res['deployments'],
            inputName: 'deployments',
            isReadOnly: false,
          }
        ];
        setConfigInputs([...arr]);
      });
    }
  }, [userId]);


  const onSubmit = (data: any) => {

    console.table(data);
    //let next = tabs.indexOf(activeWindow);
    //setActiveWindow(tabs[next + 1]);
    const adminConfig = {
      clientID: data.client_id,
      oidcIssuer: data.oidc_issuer,
      authLoginURL: data.auth_login_url,
      publicKeyURL: data.public_key_url,
      authTokenURL: data.auth_token_url,
      deployments: data.deployments,
      userId: userId,
    };
    updateAdminConfig(adminConfig);
  };
  const [activeWindow, setActiveWindow] = useState('Configuration');
  const [fields, setFields] = useState({});

  const tabs = ['Configuration'];

  return (
    <>
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
        {/*activeWindow === 'Basics' ? (
          <form onSubmit={handleSubmit(onSubmit)} className={classes.canvas_form}>
            <input
              placeholder="LTI 1.3 Connection Name"
              className={errors.appName ? classes['invalid'] : undefined}
              {...register('appName', { required: true })}
            />
            {errors.appName && <span>This field is required</span>}
            <input value="Next" type="submit" />
          </form>
        ) : null*/}

        {activeWindow === 'Configuration' && configInputs.length > 1 ? (
          <>
            <div>Copy the first 4 fields in your Canvas instance.</div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.canvas_form}>
              <LtiTab fields={configInputs} register={register} />
              <input value='Next' type='submit' />
            </form>
          </>) : null}
      </div>
    </>
  );
};

export default LtiConfig;
