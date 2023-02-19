import Form from '../Common/Form/Form';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { SubmitHandler } from 'react-hook-form';
import UserForm from '../../types/UserForm';
import { authSliceActions } from '../../redux/store';
import { registerUser } from '../../service/AuthService';
import toast from 'react-hot-toast';

const RegisterForm = () => {

  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    const response = registerUser(data);
    response.then((res) => {
      localStorage.isLoggedIn = true;
      dispatch(authSliceActions.saveLoginInfo({ isLoggedIn: true }));
      void router.push('lti-config');
    }).catch((err) => {
        toast.error('Could not register user!');
      }
    );
  };

  const inputs = [{ name: 'email', type: 'email' }, { name: 'password', type: 'text' }];

  return (
    <Form buttonName={'Register'} inputs={inputs} submit={onSubmit} />
  );
};

export default RegisterForm;
