import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions } from '../../redux/store';
import { getAssignments } from '../../service/AssignmentService';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import styles from './Student.module.scss';
import Link from 'next/link';
import IAssignment from '../../types/IAssignment';

const Student = () => {
  const dispatch = useDispatch();
  const { userId, contextId } = useSelector((state) => state.auth);
  const { assignments } = useSelector((state) => state.assignment);
  const [currentAssignments, setAssignments] = useState<IAssignment[]>([]);

  useEffect(() => {
    if (userId !== undefined) {
      getAssignments(userId, contextId).then(async (response) => {
          if (response.data?.length === 0) {
            toast.success('Teacher has not created any assigment yet');
          } else {
            setAssignments(response.data);
            dispatch(assignmentSliceActions.saveAssignments(response.data.map(a => {
              return { id: a.id, name: a.name, gameId: a.game };
            })));
          }
        }
      ).catch((error) =>
        toast.error(error.message)
      );
    }
  }, [userId]);

  return (
    <>
      {assignments.length === 0
        ? <div>Your teacher has not created any assignments, please try again later</div>
        : <div className={styles.cardsContainer}>
          {currentAssignments.map((a) => {
            return <Link href={`/game?assignmentId=${a.id}&gameId=${a.gameId}`} key={a.id}
                         className={a.inProgress ? styles.card + ' ' + styles.inProgress : styles.card}>{a.name}</Link>;
          })}
        </div>}
    </>
  );
};

export default Student;
