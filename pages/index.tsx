import LoginForm from '../src/components/Login/Login';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { authSliceActions } from '../src/redux/store';
import { useRouter } from 'next/navigation';

function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [hasLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.isLoggedIn == 'true') {
      dispatch(authSliceActions.saveLoginInfo({ isLoggedIn: true }));
      setIsLoggedIn(true);
    }
  }, []);

  return <>{hasLoggedIn ? router.push('lti-config') : <LoginForm />}</>;
}

export default HomePage;
