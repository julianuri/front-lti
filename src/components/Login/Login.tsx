import Form from '../Common/Form/Form';
import { SubmitHandler } from 'react-hook-form';
import UserForm from '../../types/UserForm';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../redux/store';
import Link from 'next/link';
import { loginUser } from '../../service/AuthService';
import toast from 'react-hot-toast';

const LoginForm = () => {

  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    const response = loginUser(data);
    response.then((res) => {
      localStorage.isLoggedIn = true;
      dispatch(authSliceActions.saveLoginInfo({ isLoggedIn: true }));
      toast.success('Welcome!')
      void router.push('lti-config');
    }).catch((err) =>
      toast.error('Could not log in user!')
    );
  };

  const inputs = [{ name: 'email', type: 'email' }, { name: 'password', type: 'text' }];
  const optionalLink = <Link href={'/register'}>Sign Up</Link>

  return (
    <Form optionalLink={optionalLink} buttonName={'Log In'} inputs={inputs} submit={onSubmit} />
  );
};

export default LoginForm;
