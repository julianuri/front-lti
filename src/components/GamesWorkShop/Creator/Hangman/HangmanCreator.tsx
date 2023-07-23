import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './HangmanCreator.module.scss';
import WordForm from './WordForm/WordForm';
import { saveAssignment } from '../../../../service/AssignmentService';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import IHangmanQuestion from '../../../../types/props/IHangmanQuestion';
import IAssignment from '../../../../types/IAssignment';

const HangmanCreator = ({ gameId }: { gameId: number }) => {

  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId, resourceId, lineitemUrl } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [words, setWords] = useState<IHangmanQuestion[]>([]);
  const [showQuestionModal, setQuestionModal] = useState(false);

  const onSubmit = (data: any) => {
    const request = {
      assignmentName: data.assignmentName,
      attempts: data.attempts,
      questions: [...words],
      courseId: contextId,
      gameId: gameId,
      requiredAssignmentId: null,
      resourceId: resourceId,
      lineitemUrl: lineitemUrl,
    };

    if (data.requiredAssignmentId != '' ) {
      request.requiredAssignmentId = data.requiredAssignmentId;
    }

    saveAssignment(request).then(async (response) => {
      dispatch(assignmentSliceActions.saveAssignment({
        id: response.data.id,
        name: response.data.name,
        gameId: response.data.gameId
      }));
      setWords([]);
      reset();
      toast.success('Assignment Saved!');
    }).catch((error) =>
      toast.error(error.message)
    );
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = words.filter((q, i) => i != index);
    setWords([...newQuestions]);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <label>Assignment Name</label>
          <input
            type='text'
            className={errors.assignmentName != null ? styles.isInvalidField : undefined} {...register('assignmentName', { required: true })}
          />
        </div>
        <div className={styles.field}>
          <label>Attempts</label>
          <div>
            <input
              type='number' min={1} max={5}
              className={(errors['attempts'] != null) ? styles.isInvalidField + '' + styles.fullWidth : styles.fullWidth} {...register('attempts', { required: true })}
            />
          </div>
        </div>
        <div className={styles.field}>
          <label>
            Linked Assignment
          </label>
          <select {...register('requiredAssignmentId')}>
            <option value=''>No Linked Assignment</option>
            {assignments.map((a: IAssignment) => {
              return <option key={a.id} value={a.id}>{a.name}</option>;
            })}
          </select>
        </div>
        <div className={styles.cardsContainer}> {words.map((wordProps, index) => {
          return (
            <>
              <div className={styles.card} key={wordProps.wordToGuess}>{wordProps.wordToGuess} <span
                className={styles.delete}
                onClick={() => deleteQuestion(index)}
              >X
							</span>
              </div>
            </>
          );
        })}
        </div>

        <div className={styles.button} onClick={() => setQuestionModal(true)}>Add question</div>

        <input className={styles.button + ' ' + styles.atTheEnd} value='Create' type='submit' disabled={words.length == 0} />
      </form>
      {showQuestionModal
        ? <>
          <div className={styles.overlay}></div>
          <WordForm words={words} setWords={setWords} setShowModal={setQuestionModal} />
        </>
        : null}
    </>
  );
};

export default HangmanCreator;
