import classes from './Layout.module.scss';
import SideBar from './Common/SideBar/SideBar';
import Link from 'next/link';
import { authSliceActions, avatarSliceActions, RootState } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import sideBarClasses from '../components/Common/SideBar/SideBar.module.scss';
import { getAvatarConfig, saveAvatarConfig } from '../service/AvatarService';
import toast from 'react-hot-toast';

const Layout = (props: any) => {

  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { avatarConfig } = useSelector((state: RootState) => state.avatarConfig);
  const [avatar, setAvatar] = useState(avatarConfig);
  const { isStudent, isInstructor, userId } = useSelector((state: RootState) => state.auth);
  const [assignmentsState, setAssignments] = useState([]);
  const hasLoaded = useRef<boolean>(false);
  const [isStudentState, setIsStudentState] = useState(false);
  const [isInstructorState, setIsInstructorState] = useState(false);

  useEffect(() => {
    setAssignments(assignments);
  }, [assignments]);

  useEffect(() => {
    setAvatar(avatarConfig);
  }, [avatarConfig]);

  useEffect(() => {
    if (hasLoaded.current) {
      if (isStudent === 'True') {
        processAvatarConfig();
      }

    } else {
      setIsStudentState(isStudent === 'True');
      setIsInstructorState(isInstructor === 'True');
      hasLoaded.current = true;
    }

  }, []);

  const processAvatarConfig = function() {
    getAvatarConfig(userId).then((res) => {
      if (res.data == null) {
        const config = genConfig();
        dispatch(avatarSliceActions.saveConfig({ ...config }));

        saveAvatarConfig(config, userId).catch((error) =>
          toast.error(error.message)
        );

        setAvatar(config);
      } else {
        dispatch(avatarSliceActions.saveConfig({ ...res.data.config }));
        setAvatar({ ...res.data.config });
      }
    }).catch((error) =>
      toast.error(error.message)
    );
  };

  const logout = () => {
    localStorage.clear();
    dispatch(authSliceActions.logout());
  };

  return (
    <div className={classes.lti_page}>
      <SideBar>
        {(isStudentState) ? <Avatar style={{ width: '8rem', height: '8rem' }} {...avatar} /> : null}
        <div className={sideBarClasses.child + ' ' + sideBarClasses['centered-child']}>You
          have {assignmentsState.length} assignments
        </div>
        {(isStudentState || isInstructorState) ? null : <Link onClick={() => logout()} href='/'>Logout</Link>}
      </SideBar>
      <main className={classes.main}>{props?.children}</main>
    </div>
  );
};

export default Layout;
