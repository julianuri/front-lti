import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './QuizCreator.module.scss';
import QuizQuestionForm from './QuestionForm/QuizQuestionForm';
import { saveAssignment } from '../../../../service/AssignmentService';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import IQuizQuestion from '../../../../types/props/IQuizQuestion';
import IAssignment from '../../../../types/IAssignment';

const QuizCreator = ({ gameId }: { gameId: number }) => {

  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId, resourceId, lineitemUrl } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [questions, setQuestions] = useState<IQuizQuestion[]>([]);
  const [showQuestionModal, setQuestionModal] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    const request = {
      assignmentName: data.assignmentName,
      attempts: data.attempts,
      questions: [...questions],
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
      setQuestions([]);
      reset();
      toast.success('Assignment Saved!');
    }).catch((error) =>
      toast.error(error.message)
    );
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = questions.filter((q, i) => i != index);
    setQuestions([...newQuestions]);
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
        <div className={styles.cardsContainer}> {questions.map((question, index) => {
          return (
            <>
              <div className={styles.card} key={question.question}>{question.question} <span
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

        <input className={styles.button + ' ' + styles.atTheEnd} value='Create' type='submit' disabled={questions.length == 0} />
      </form>
      {showQuestionModal
        ? <>
          <div className={styles.overlay}></div>
          <QuizQuestionForm questions={questions} setQuestions={setQuestions} setShowModal={setQuestionModal} />
        </>
        : null}
    </>
  );
};

export default QuizCreator;
