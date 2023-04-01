import { useEffect, useState } from 'react';
import styles from './LtiConfig.module.scss';
import { useForm } from 'react-hook-form';
import { getAdminConfig, updateAdminConfig } from '../../service/AdminConfigService';
import { useSelector } from 'react-redux';
import adminConfig from '../../types/AdminConfig';
import toast from 'react-hot-toast';

const LtiConfig = () => {
	const deploymentRegex = /^\d:([a-zA-Z\d]){20,40}(?:[,;]\d:([a-zA-Z\d]){20,40}){0,9}$/;
	const { userId } = useSelector((state) => state.auth);
	const { register, handleSubmit, formState: { errors }, reset } = useForm();
	const [activeWindow, setActiveWindow] = useState('Tool');

	const tabs = ['Tool', 'Canvas'];

	useEffect(() => {
		if (userId != 'undefined' && userId != undefined && userId != 0) {
			getAdminConfig(userId).then((res: any) => {
				reset({ ...res });
			});
		}
	}, []);

	const changeTab = (step: number) => {
		const next = tabs.indexOf(activeWindow);
		setActiveWindow(tabs[next + step]);
	};

	const onSubmit = (data: adminConfig) => {
		console.table(data);
		const deployments = '[' + data.deployments.split(',').map(x => `"${x}"`).join(',') + ']';
		const adminConfig = {
			clientID: data.client_id,
			oidcIssuer: data.oidc_issuer,
			authLoginURL: data.auth_login_url,
			publicKeyURL: data.public_key_url,
			authTokenURL: data.auth_token_url,
			deployments,
			userId
		};
		updateAdminConfig(adminConfig).then(async (response) => {
			if (!response.ok) {
				const message = `An error has occurred: ${response.status}`;
				throw new Error(message);
			}
			toast.success('Configuration updated!');
		}).catch((error) =>
			toast.error(error.message)
		);
	};

	return (
		<>
			<div className={styles.lti_config_section}>
				<ul className={styles.lti_tabs}>
					{tabs.map((tab) => {
						return (
							<li key={tab} id={tab} className={activeWindow === tab ? styles.active : undefined}>
								{tab}
							</li>
						);
					})}
				</ul>
				<>
					{activeWindow === 'Tool'
						? (
							<>
								<div>Copy the fields in your Canvas instance.</div>
								<form className={styles.form}>
									<div>
										<label>Redirect URI</label>
										<input readOnly {...register('redirect_uri', { required: true })} />
									</div>
									<div>
										<label>Target Link URI</label>
										<input readOnly {...register('target_uri', { required: true })} />
									</div>
									<div>
										<label>OpenID URL</label>
										<input readOnly {...register('openid_url', { required: true })} />
									</div>
									<div className={styles.deployments}>
										<label>JWK</label>
										<input readOnly {...register('public_jwk', { required: true })} />
									</div>
									<input value='Next' type='submit' onClick={() => changeTab(1)} />
								</form>
							</>)
						: null}

					{activeWindow === 'Canvas'
						? (
							<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
								<div>
									<label>Client ID</label>
									<input {...register('client_id', { required: true })} />
									{(errors.client_id != null) && 'Client id is required'}
								</div>
								<div>
									<label>OIDC Issuer</label>
									<input {...register('oidc_issuer', { required: true })} />
								</div>
								<div>
									<label>Auth Login URL</label>
									<input {...register('auth_login_url', { required: true })} />
								</div>
								<div>
									<label>Public Key URL</label>
									<input {...register('public_key_url', { required: true })} />
								</div>
								<div>
									<label>Auth Token URL</label>
									<input {...register('auth_token_url', { required: true })} />
								</div>
								<div className={styles.deployments}>
									<label>Deployment IDs</label>
									<textarea {...register('deployments', {
										required: true,
										pattern: {
											value: deploymentRegex,
											message: 'Wrong deployment format'
										}
									})}
									/>
								</div>
								{((errors?.deployments) != null) ? <div>{errors.deployments.message}</div> : null}
								<input value='Back' type='submit' onClick={() => changeTab(-1)} />
								<input value='Save' type='submit' />
							</form>
						)
						: null}
				</>
			</div>
		</>
	);
};

export default LtiConfig;
