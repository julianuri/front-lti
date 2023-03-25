import Form from '../Common/Form/Form';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import UserForm from '../../types/UserForm';
import { authSliceActions } from '../../redux/store';
import { registerUser } from '../../service/AuthService';
import toast from 'react-hot-toast';
import { authState } from '../../features/auth/authSlice';

const RegisterForm = () => {

  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserForm> = (data) => {
    registerUser(data).then(async (response) => {
      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
      }
      const data: authState = await response.json();
      dispatch(authSliceActions.saveLoginInfo({ isLoggedIn: true, userId: data.userId }));
      toast.success('User registered!');
      void router.push('lti-config');
    }).catch((error) => {
        toast.error(error.message);
      }
    );
  };

  const inputs = [{ name: 'email', type: 'email' }, { name: 'password', type: 'text' }];

  return (
    <Form buttonName={'Register'} inputs={inputs} submit={onSubmit} />
  );
};

export default RegisterForm;
