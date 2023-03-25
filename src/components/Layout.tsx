import classes from './Layout.module.scss';
import SideBar from './Common/SideBar/SideBar';
import Link from 'next/link';
import { authSliceActions } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Layout = ({ children }) => {

  const dispatch = useDispatch();
  const { assignments } = useSelector((state) => state.assignment);
  const { isStudent, isInstructor } = useSelector((state) => state.auth);
  const [assignmentsState, setAssignments] = useState([]);

  useEffect(() => {
    if (assignments != null) {
      setAssignments(assignments);
    }
  }, [assignments]);

  const logout = () => {
    localStorage.clear();
    dispatch(authSliceActions.logout());
  };

  return (
    <div className={classes.lti_page}>
      <SideBar>
        <div>Assignments: {assignmentsState.length}</div>
        {(isStudent || isInstructor) ? null : <Link onClick={() => logout()} href={'/'}>Logout</Link>}
      </SideBar>
      <main className={classes.main}>{children}</main>
    </div>
  );
};

export default Layout;
