import classes from './Layout.module.scss';
import Link from 'next/link';
import {
  authSliceActions,
  avatarSliceActions,
  RootState
} from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import Avatar, { genConfig } from 'react-nice-avatar';
import { getAvatarConfig, saveAvatarConfig } from '../service/AvatarService';
import { Box, NavLink } from '@mantine/core';
import {
  IconDeviceGamepad,
  IconQuestionMark,
  IconReportAnalytics, IconUserCircle
} from '@tabler/icons-react';
import RoleEnum from '../types/enums/RoleEnum';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';

const Layout = (props: any) => {

  const dispatch = useDispatch();
  const route = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const { avatarConfig } = useSelector((state: RootState) => state.avatarConfig);
  const [avatar, setAvatar] = useState({...avatarConfig});
  const { role, userId } = useSelector((state: RootState) => state.auth);
  const [roleUI, setRole] = useState('');
  const hasLoaded = useRef<boolean>(false);

  const [menu, setMenu] = useState([{
    key: 0,
    variant: 'light',
    label: 'Tareas',
    icon: <IconDeviceGamepad size={36} strokeWidth={2} color={'#407fbf'} />,
    childrenOffset: 28,
    role: 'TEACHER|STUDENT',
    href: '/assignment'
  },
    {
      key: 1,
      variant: 'light',
      label: 'Tareas',
      icon: <IconDeviceGamepad size={36} strokeWidth={2} color={'#407fbf'} />,
      childrenOffset: 28,
      role: 'STUDENT',
      href: '/student/assignments'
    },
    {
      key: 2,
      label: 'Banco de Preguntas',
      icon: <IconQuestionMark size={36} strokeWidth={2} color={'#407fbf'} />,
      role: 'TEACHER',
      href: '/banks'
    },
    {
      key: 3,
      label: 'Estadísticas',
      role: 'TEACHER|STUDENT',
      icon: <IconReportAnalytics size={36} strokeWidth={2} color={'#407fbf'} />,
      childrenOffset: 28
    },
    {
      key: 4,
      label: 'Avatar',
      role: 'STUDENT',
      icon: <IconReportAnalytics size={36} strokeWidth={2} color={'#407fbf'} />,
      href: '/student/avatar'
    }
  ]);

  useEffect(() => {
    if (role !== '' && role !== undefined && role !== null) {
      setRole(role);
      setMenu([{
        key: 0,
        variant: 'light',
        label: 'Tareas',
        icon: <IconDeviceGamepad size={36} strokeWidth={2} color={'#407fbf'} />,
        childrenOffset: 28,
        role: 'TEACHER',
        href: '/assignment',
      },
        {
          key: 1,
          variant: 'light',
          label: 'Tareas',
          icon: <IconDeviceGamepad size={36} strokeWidth={2} color={'#407fbf'} />,
          childrenOffset: 28,
          role: 'STUDENT',
          href: '/student/assignments'
        },
        {
          key: 2,
          label: 'Banco de Preguntas',
          icon: <IconQuestionMark size={36} strokeWidth={2} color={'#407fbf'} />,
          role: 'TEACHER',
          href: '/banks'
        },
        {
          key: 3,
          label: 'Estadísticas',
          icon: <IconReportAnalytics size={36} strokeWidth={2} color={'#407fbf'} />,
          childrenOffset: 28,
          role: 'TEACHER|STUDENT',
        },
        {
          key: 4,
          label: 'Avatar',
          role: 'STUDENT',
          icon: <IconUserCircle size={36} strokeWidth={2} color={'#407fbf'} />,
          href: '/student/avatar'
        }
      ]);
    }
  }, [role]);

  useEffect(() => {
    setAvatar(avatarConfig);
  }, [avatarConfig]);

  useEffect(() => {
    if ((hasLoaded.current || process.env.NODE_ENV !== 'development') && userId != null) {
        processAvatarConfig();
    }
    return () => {
      hasLoaded.current = true;
    };
  }, [userId]);

  const processAvatarConfig = function() {
    getAvatarConfig(userId)
      .then((res) => {
        if (res.data == null) {
          const config = genConfig();
          dispatch(avatarSliceActions.saveConfig({ ...config }));

          saveAvatarConfig(config, userId).catch((error) =>
            notifications.show({ message: error.message, autoClose: false, color: 'red'})
          );

          setAvatar(config);
        } else {
          dispatch(avatarSliceActions.saveConfig({ ...res.data.config }));
          setAvatar({ ...res.data.config });
        }
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
  };

  const logout = () => {
    localStorage.clear();
    dispatch(authSliceActions.logout());
  };


  return (
    <div className={classes.lti_page}>
      { (roleUI !== '') ? <Box w={'100%'}>
        { roleUI.includes(RoleEnum.STUDENT) ? <Avatar style={{ width: '8rem', height: '8rem', margin: 'auto', marginBottom: '1rem' }} {...avatar} /> : null}
        { menu.filter(c => c.role.includes(roleUI)).map((navLink) => {
        return <NavLink active={navLink.key === activeIndex}
                        onClick={() => {
                          setActiveIndex(navLink.key);
                          if(navLink?.href) {
                            void route.replace(navLink?.href);
                          }
                        }}

                        variant={navLink.variant} key={navLink.key}
                        label={navLink.label}
                        icon={navLink.icon}
                        childrenOffset={navLink?.childrenOffset}>
          { (navLink?.children) ? navLink.children
            .filter(c => c.role.includes(roleUI))
            .map((child) => {
            return <NavLink key={child.key} label={child.label} component={Link} href={child.href}></NavLink>;
          }): null}
        </NavLink>;
      })}</Box> : null}
      <main className={classes.main}>{props?.children}
      </main>
    </div>
  );
};

export default Layout;
