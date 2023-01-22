import { useState } from 'react';
import classes from './Login.module.scss';
import Input from '../Common/Input/Input';
import Image from 'next/image';
import profilePic from '../../public/istockphoto-518654434-612x612.jpg';
import Link from 'next/link';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function fieldsHandler(e: HTMLInputElement) {
    switch (e.id) {
      case 'email':
        setEmail(e.value);
        break;
      case 'password':
        setPassword(e.value);
        break;
      default:
        break;
    }
  }

  return (
    <div className={classes.login_section}>
      <Image className={classes.profile_picture} src={profilePic} alt="profile" width={200} height={200} />
      <Input>
        <input
          id="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => {
            fieldsHandler(e.target);
          }}
        />
      </Input>

      <Input>
        <input
          id="password"
          type="text"
          placeholder="Enter password"
          value={password}
          onChange={(e) => {
            fieldsHandler(e.target);
          }}
        />
      </Input>
      <div className={classes.buttons}>
        <button
          onClick={() => {
            alert('SIGN IN');
          }}
        >
          Sign In
        </button>
        <button>
          <Link href={'/register'}>Sign Up</Link>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
