import Form from '../Common/Form/Form';
import { SubmitHandler } from 'react-hook-form';
import UserForm from '../../types/UserForm';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../redux/store';
import Link from 'next/link';
import { verifyUserCredentials } from '../../service/AuthService';
import toast from 'react-hot-toast';
import { authState } from '../../features/auth/authSlice';

const LoginForm = () => {

  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    verifyUserCredentials(data).then(async (response) => {
      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
      }
      const data: authState = await response.json();
      dispatch(authSliceActions.saveLoginInfo({ isLoggedIn: true, userId: data.userId }));
      toast.success('Welcome!');
      void router.push('lti-config');
    }).catch((error) =>
      toast.error(error.message)
    );
  };

  const inputs = [{ name: 'email', type: 'email' }, { name: 'password', type: 'text' }];
  const optionalLink = <Link href={'/register'}>Sign Up</Link>;

  return (
    <Form optionalLink={optionalLink} buttonName={'Log In'} inputs={inputs} submit={onSubmit} />
  );
};

export default LoginForm;
