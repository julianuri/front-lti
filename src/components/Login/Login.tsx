import Form from '../Common/Form/Form';
import { SubmitHandler } from 'react-hook-form';
import UserForm from '../../types/UserForm';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { authSliceActions } from '../../redux/store';
import Link from 'next/link';

const LoginForm = () => {

  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    fetch('https://localhost:9008', {
      method: 'POST',
      body: JSON.stringify({ data })
    })
      .then((res) => console.log('finished'))
      .catch((error) => {
        localStorage.isLoggedIn = true;
        dispatch(authSliceActions.saveLoginInfo({ isLoggedIn: true }));
        void router.push('lti-config');
      });
  };

  const inputs = [{ name: 'email', type: 'email' }, { name: 'password', type: 'text' }];
  const optionalLink = <Link href={'/register'}>Sign Up</Link>

  return (
    <Form optionalLink={optionalLink} buttonName={'Login'} inputs={inputs} submit={onSubmit} />
  );
};

export default LoginForm;
