import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../../redux/store';
import { getAssignments } from '../../../service/AssignmentService';
import { useEffect, useState } from 'react';
import styles from './Assignments.module.scss';
import Link from 'next/link';
import IAssignment from '../../../types/IAssignment';
import { notifications } from '@mantine/notifications';

const Student = () => {
  const dispatch = useDispatch();
  const { userId, contextId } = useSelector(
    (state: RootState) => state.auth,
  );
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const [currentAssignments, setAssignments] = useState<IAssignment[]>([]);

  useEffect(() => {
    if (userId !== undefined) {
        getAssignments(userId, contextId, true)
          .then(async (response) => {
            if (response.data?.length === 0) {
              notifications.show({message: 'El profesor no ha creado ninguna tarea', autoClose: 3000});
            } else {
              setAssignments(response.data);
              dispatch(
                assignmentSliceActions.saveAssignments(
                  response.data.map((a: IAssignment) => {
                    return { ...a };
                  }),
                ),
              );
            }
          })
          .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
      }

  }, [userId]);

  const getTooltipAndLinkClasses = function (a: IAssignment) {
    let classes = undefined;
    let cardClasses = styles.card + ' ';
    if (
      a.attemptsLeft <= 0 ||
      (a.requiredAssignment != null && !a.requiredAssignmentSatisfied)
    ) {
      classes = styles.unclickable;
      cardClasses += styles.disabledCard;
    }
    return { classes, cardClasses };
  };

  const printMessage = function (a: IAssignment) {
    if (a.attemptsLeft <= 0) {
      notifications.show({message: 'Se acabaron los intentos', autoClose: 3000});
    } else if (a.requiredAssignment != null && !a.requiredAssignmentSatisfied) {
      notifications.show({ message:`Necesitas completar ${currentAssignments.find(
          (x: IAssignment) => x.id == a.requiredAssignment,
        )?.name}`, autoClose: 3000});
    }
  };

  return (
    <div className={styles.container}>
      {assignments?.length === 0 ? (
        <div>
          Your teacher has not created any assignments, please try again later
        </div>
      ) : (
        <div className={styles.cardsContainer}>
          {currentAssignments.map((a) => {
            const tooltip = getTooltipAndLinkClasses(a);

            return (
              <div
                onClick={() => printMessage(a)}
                key={a.id}
                className={
                  a.inProgress
                    ? tooltip.cardClasses + ' ' + styles.inProgress
                    : tooltip.cardClasses
                }
              >
                <Link
                  className={tooltip.classes}
                  href={`/game?assignmentId=${a.id}&gameId=${a.gameId}`}
                >
                  <div>{a.name}</div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      <Link className={styles.button} href="/student">
        back
      </Link>
    </div>
  );
};

export default Student;
