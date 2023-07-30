import { useEffect, useState } from 'react';
import { getAllQuestionBanks } from '../../../../service/QuestionBankService';
import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import styles from './SnakeMaker.module.scss';
import IAssignment from '../../../../types/IAssignment';
import { useForm } from 'react-hook-form';
import { saveAssignment } from '../../../../service/AssignmentService';
import BOARDS from '../../../../types/enums/BoardsEnum';
import Carousel from './Carousel/Carousel';
import { notifications } from '@mantine/notifications';

const SnakeMaker = function ({ gameId }: { gameId: number }) {
  const dispatch = useDispatch();
  const { userId } = useSelector((state: RootState) => state.auth);
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId } = useSelector((state: RootState) => state.auth);
  const [questionBanks, setQuestionBanks] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm();
  const [selectedCarouselItem, setSelectedCarouselItem] = useState(0);

  useEffect(() => {
    getAllQuestionBanks(userId).then((data) => {
      setQuestionBanks(data.data);
    });
  }, []);

  const onSubmit = (data: any) => {
    //questions: [...items],
    const request = {
      assignmentName: data.assignmentName,
      attempts: data.attempts,
      courseId: contextId,
      gameId: gameId,
      requiredAssignmentId: null,
      questionBankId: data.questionBankId,
      rollsToShowQuestion: data.rollsToShowQuestion,
      board: selectedCarouselItem,
    };

    if (data.questionBankId == '') {
      request.questionBankId = questionBanks[0].id;
    }

    if (data.requiredAssignmentId != '') {
      request.requiredAssignmentId = data.requiredAssignmentId;
    }

    saveAssignment(request)
      .then(async (response) => {
        dispatch(
          assignmentSliceActions.saveAssignment({
            id: response.data.id,
            name: response.data.name,
            gameId: response.data.gameId,
          }),
        );
        reset();
        notifications.show({message: 'La tarea fue guardada exitosamente', autoClose: 3000});
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red'}));
  };

  const handleClick = function (id: number) {
    setSelectedCarouselItem(id);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <label>Assignment Name</label>
          <input
            type="text"
            className={
              errors.assignmentName != null ? styles.isInvalidField : undefined
            }
            {...register('assignmentName', { required: true })}
          />
        </div>
        <div className={styles.field}>
          <label>Attempts</label>
          <div>
            <input
              type="number"
              min={1}
              max={20}
              className={
                errors['attempts'] != null
                  ? styles.isInvalidField + ' ' + styles.fullWidth
                  : styles.fullWidth
              }
              {...register('attempts', { required: true })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label>Rolls</label>
          <div>
            <input
              type="number"
              min={5}
              max={20}
              className={
                errors['rollsToShowQuestion'] != null
                  ? styles.isInvalidField + ' ' + styles.fullWidth
                  : styles.fullWidth
              }
              {...register('rollsToShowQuestion', { required: true })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label>Linked Assignment</label>
          <select {...register('requiredAssignmentId')}>
            <option value="">No Linked Assignment</option>
            {assignments.map((a: IAssignment) => {
              return (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className={styles.field}>
          <label>Linked Question Bank</label>
          <select {...register('questionBankId')}>
            {questionBanks.map((a: any) => {
              return (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              );
            })}
          </select>
        </div>
        {
          <div className={styles.cardsContainer}>
            <Carousel
              selected={BOARDS[selectedCarouselItem]}
              handleClick={handleClick}
            />
          </div>
        }

        <input
          className={styles.button + ' ' + styles.atTheEnd}
          value="Create"
          type="submit"
          disabled={!isValid}
        />
      </form>
    </>
  );
};

export default SnakeMaker;
