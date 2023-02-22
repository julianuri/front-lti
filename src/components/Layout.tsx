import classes from './Layout.module.scss';
import SideBar from './Common/SideBar/SideBar';
import Link from 'next/link';
import { authSliceActions } from '../redux/store';
import { useDispatch } from 'react-redux';

const Layout = ({ children }) => {

  const dispatch = useDispatch();

  const logout = () => {
    localStorage.clear();
    dispatch(authSliceActions.logout());
  };

  return (
    <div className={classes.lti_page}>
      <SideBar>
        <div>Courses</div>
        <Link onClick={() => logout()} href={'/'}>Logout</Link>
      </SideBar>
      <main className={classes.main}>{children}</main>
    </div>
  );
};

export default Layout;
