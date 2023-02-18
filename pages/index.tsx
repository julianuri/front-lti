import LoginForm from '../src/components/Login/Login';
import { useSelector, useDispatch } from 'react-redux';
import LtiConfigPage from './lti-config';
import { useEffect } from 'react';
import { authSliceActions } from '../src/redux/store';

function HomePage() {

  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const auth = typeof window !== 'undefined' ? localStorage.isLoggedIn : null;
    if (auth !== undefined && auth == 'true') {
      dispatch(authSliceActions.saveLoginInfo({ isLoggedIn: true }));
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
