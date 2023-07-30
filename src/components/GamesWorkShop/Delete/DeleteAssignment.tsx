import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styles from './DeleteAssignment.module.scss';
import Link from 'next/link';
import { assignmentSliceActions } from '../../../redux/store';
import { dropAssignment } from '../../../service/AssignmentService';
import IAssignment from '../../../types/IAssignment';
import { notifications } from '@mantine/notifications';

const DeleteAssignment = () => {
  const dispatch = useDispatch();
  const { assignments } = useSelector((state) => state.assignment);
  const [currentAssignments, setAssignments] = useState<IAssignment[]>([]);

  useEffect(() => {
    if (assignments != undefined) {
      setAssignments(assignments);
    }
  }, [assignments]);

  const deleteAssignment = (id: number) => {
    const newAssignments = currentAssignments.filter((x) => x.id != id);
    dropAssignment(id)
      .then(async () => {
        dispatch(assignmentSliceActions.saveAssignments(newAssignments));
        notifications.show({message: 'La tarea fue borrada exitosamente', autoClose: 3000});
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
  };

  return (
    <div className={styles.page}>
      <div className={styles.cardsContainer}>
        {currentAssignments.map((assignment) => {
          return (
            <div
              key={assignment.id}
              className={styles.card}
              onClick={() => deleteAssignment(assignment.id)}
            >
              {assignment.name}
            </div>
          );
        })}
      </div>
      <Link className={styles.button} href="/instructor">
        Back
      </Link>
    </div>
  );
};

export default DeleteAssignment;
