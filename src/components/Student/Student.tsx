import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../redux/store';
import { getAssignments } from '../../service/AssignmentService';
import toast from 'react-hot-toast';
import { useEffect, useRef } from 'react';
import styles from './Student.module.scss';
import Link from 'next/link';
import IAssignment from '../../types/IAssignment';

const Student = () => {

  const dispatch = useDispatch();
  const { userId, contextId, isStudent } = useSelector((state: RootState) => state.auth);
  const hasLoaded = useRef(false);

  //TODO: EVALUATE IF USE EFFECT SHOULD BE REMOVED WHEN STUDENT LAYOUT IS CHANGED
  useEffect(() => {
    if (userId !== undefined) {
      if (hasLoaded.current) {
        getAssignments(userId, contextId, isStudent).then((response) => {
            if (response.data?.length === 0) {
              toast.success('Teacher has not created any assigment yet');
            } else {
              dispatch(assignmentSliceActions.saveAssignments(response.data.map((a: IAssignment) => {
                return { ...a };
              })));
            }
          }
        ).catch((error) =>
          toast.error(error.message)
        );
      } else {
        hasLoaded.current = true;
      }
    }
  }, [userId]);

  return (
    <>
      <div className={styles.cardsContainer}>
        <Link className={styles.card} href={'/student/assignments'}>Assignments</Link>
        <Link className={styles.card} href={'student/avatar'}>Avatar Builder</Link>
      </div>
    </>
  )
    ;
};

export default Student;
