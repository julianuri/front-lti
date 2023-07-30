import Form from '../Common/Form/Form';
import { SubmitHandler } from 'react-hook-form';
import UserForm from '../../types/UserForm';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../redux/store';
import Link from 'next/link';
import { verifyUserCredentials } from '../../service/AuthService';
import { AuthState } from '../../features/auth/authSlice';
import styles from './Login.module.scss';
import TestForm from '../Common/TestForm/TestForm';
import { notifications } from '@mantine/notifications';

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    verifyUserCredentials(data)
      .then(async (response) => {
        if (!response.ok) {
          const message = `An error has occurred: ${response.status}`;
          throw new Error(message);
        }
        const data: AuthState = await response.json();
        dispatch(
          authSliceActions.saveLoginInfo({
            isLoggedIn: true,
            userId: data.userId,
          }),
        );
        notifications.show({ message: 'Bienvenido', autoClose: 3000});
        router.push('lti-config');
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
  };

  const inputs = [
    { name: 'email', type: 'email' },
    { name: 'password', type: 'text' },
  ];
  const optionalLink = (
    <Link className={styles.button} href="/register">
      Sign Up
    </Link>
  );

  const form = (
    <TestForm
      optionalLink={optionalLink}
      inputs={[
        {
          name: 'email',
          type: 'email',
          label: 'email',
          width: 'full-row',
        },
        {
          name: 'password',
          type: 'password',
          label: 'password',
          width: 'full-row',
        },
      ]}
      submit={onSubmit}
      buttonName={'Log In'}
    />
  );
  return (
    /*<Form optionalLink={optionalLink} buttonName='Log In' inputs={inputs} submit={onSubmit} />*/
    <div className={styles.centered}>{form}</div>
  );
};

export default LoginForm;
