import RegisterForm from '../../src/components/Register/Register';
import Link from 'next/link';

function RegisterPage() {
  return (
    <>
      <RegisterForm />
      <h2>
        <Link href="/">Login Page</Link>
      </h2>
    </>
  );
}

export default RegisterPage;
