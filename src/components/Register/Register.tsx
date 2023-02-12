import Form from '../Common/Form/Form';

const RegisterForm = () => {

  const inputs = [{ name: 'email', type: 'email' }, { name: 'password', type: 'text' }];

  return (
    <Form buttonName={'Register'} inputs={inputs} submit={() => alert('register')} />
  );
};

export default RegisterForm;
