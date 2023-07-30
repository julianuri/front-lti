import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import UserForm from '../../types/UserForm';
import { authSliceActions } from '../../redux/store';
import { registerUser } from '../../service/AuthService';
import { AuthState } from '../../features/auth/authSlice';
import TestForm from '../Common/TestForm/TestForm';
import styles from './Register.module.scss';
import { notifications } from '@mantine/notifications';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    registerUser(data)
      .then(async (response: AuthState) => {
        dispatch(
          authSliceActions.saveLoginInfo({
            isLoggedIn: true,
            userId: response.id,
          }),
        );
        notifications.show({ message: 'Usuario Registrado', autoClose: false, });
        router.push('lti-config');
      })
      .catch((error) => {
        notifications.show({ message: error.message, autoClose: false, color: 'red'});
      });
  };

  const inputs = [
    { name: 'email', type: 'email' },
    { name: 'password', type: 'text' },
  ];

  const testInputs = (
    <TestForm
      inputs={[
        { name: 'email', type: 'email', label: 'email', width: 'full-row' },
        {
          name: 'password',
          type: 'password',
          label: 'password',
          width: 'full-row',
        },
      ]}
      submit={onSubmit}
      buttonName={'Register'}
    />
  );

  return <div className={styles.centered}>{testInputs}</div>;
};

export default RegisterForm;
