import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import styles from './DeleteAssignment.module.scss';
import Link from 'next/link';
import { assignmentSliceActions } from '../../../redux/store';
import { dropAssignment, getAssignments } from '../../../service/AssignmentService';
import toast from 'react-hot-toast';


const DeleteAssignment = () => {

  const dispatch = useDispatch();
  const { assignments } = useSelector((state) => state.assignment);
  const [currentAssignments, setAssignments] = useState([]);

  useEffect(() => {
    if (assignments != undefined) {
      setAssignments(assignments);
    }
  }, [assignments]);

  const deleteAssignment = (id) => {
    const newAssignments = currentAssignments.filter(x => x.id != id);
    dropAssignment(id).then(async () => {
      dispatch(assignmentSliceActions.saveAssignments(newAssignments));
      toast.success('Assignment deleted');
      }
    ).catch((error) =>
      toast.error(error.message)
    );
  }

  return (<>
    <div className={styles.cardsContainer}>
      {currentAssignments.map(a => {
        return <div className={styles.card} onClick={() => deleteAssignment(a.id)}>{a.name}</div>;
      })}
    </div>
    <br/>
    <Link href={'/instructor'}>Back</Link>
  </>);
};

export default DeleteAssignment;
