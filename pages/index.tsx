import LoginForm from '../src/components/Login/Login';
import { useSelector, useDispatch } from 'react-redux';
import LtiConfigPage from './lti-config';
import { useEffect } from 'react';
import { saveLoginInfo } from '../src/features/auth/authSlice';

function HomePage() {

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const auth = typeof window !== 'undefined' ? localStorage.isLoggedIn : null;
    if (auth !== undefined && auth == 'true') {
      dispatch(saveLoginInfo({ isLoggedIn: true }));
    }
  }, []);

  return (
    <>
      {(isLoggedIn) ?
        <LtiConfigPage /> :
        <LoginForm />
      }
    </>
  );
}

export default HomePage;
