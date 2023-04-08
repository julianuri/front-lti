import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../../redux/store';
import { getAssignments } from '../../../service/AssignmentService';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import styles from './Assignments.module.scss';
import Link from 'next/link';
import IAssignment from '../../../types/IAssignment';

const Student = () => {

  const dispatch = useDispatch();
  const { userId, contextId, isStudent } = useSelector((state: RootState) => state.auth);
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const [currentAssignments, setAssignments] = useState<IAssignment[]>([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (userId !== undefined) {
      if (hasLoaded.current) {
        getAssignments(userId, contextId, isStudent).then(async (response) => {
            if (response.data?.length === 0) {
              toast.success('Teacher has not created any assigment yet');
            } else {
              setAssignments(response.data);
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

  const getTooltipAndLinkClasses = function(a: IAssignment) {
    let classes = undefined;
    let cardClasses = styles.card + ' ';
    if (a.attemptsLeft <= 0 || (a.requiredAssignment != null && !a.requiredAssignmentSatisfied)) {
      classes = styles.noPointerEvents;
      cardClasses += styles.disabledCard;
    }
    return { classes, cardClasses };
  };

  const printMessage = function(a: IAssignment) {
    if (a.attemptsLeft <= 0) {
      toast.success('No attempts left');
    } else if (a.requiredAssignment != null && !a.requiredAssignmentSatisfied) {
      toast.success(`Need to complete ${currentAssignments.find((x: IAssignment) => x.id == a.requiredAssignment)?.name}`);
    }
  };

  return (
    <div className={styles.container}>
      {assignments?.length === 0
        ? <div>Your teacher has not created any assignments, please try again later</div>
        : <div className={styles.cardsContainer}>
          {currentAssignments.map((a) => {

            const tooltip = getTooltipAndLinkClasses(a);

            return (<div onClick={() => printMessage(a)} key={a.id}
                         className={a.inProgress ? tooltip.cardClasses + ' ' + styles.inProgress : tooltip.cardClasses}>
              <Link className={tooltip.classes} href={`/game?assignmentId=${a.id}&gameId=${a.gameId}`}>
                <div>{a.name}</div>
              </Link>
            </div>);
          })}
        </div>
      }
      <Link className={styles.button} href='/student'>back</Link>
    </div>
  )
    ;
};

export default Student;
