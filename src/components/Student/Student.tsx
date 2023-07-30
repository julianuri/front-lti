import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../redux/store';
import { getAssignments } from '../../service/AssignmentService';
import { useEffect, useRef } from 'react';
import styles from './Student.module.scss';
import Link from 'next/link';
import IAssignment from '../../types/IAssignment';
import { notifications } from '@mantine/notifications';

const Student = () => {
  const dispatch = useDispatch();
  const { userId, contextId } = useSelector(
    (state: RootState) => state.auth,
  );
  const hasLoaded = useRef(false);

  //TODO: EVALUATE IF USE EFFECT SHOULD BE REMOVED WHEN STUDENT LAYOUT IS CHANGED
  useEffect(() => {
    if (userId !== undefined) {
      if (hasLoaded.current) {
        getAssignments(userId, contextId, true)
          .then((response) => {
            if (response.data?.length === 0) {
              notifications.show({ message: 'El maestro no ha creado ninguna tarea', autoClose: 3000});
            } else {
              dispatch(
                assignmentSliceActions.saveAssignments(
                  response.data.map((a: IAssignment) => {
                    return { ...a };
                  }),
                ),
              );
            }
          })
          .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red' }));
      } else {
        hasLoaded.current = true;
      }
    }
  }, [userId]);

  return (
    <>
      <div className={styles.cardsContainer}>
        <Link className={styles.card} href={'/student/assignments'}>
          Assignments
        </Link>
        <Link className={styles.card} href={'student/avatar'}>
          Avatar Builder
        </Link>
      </div>
    </>
  );
};

export default Student;
