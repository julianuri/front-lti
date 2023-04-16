import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './GenericCreator.module.scss';
import { saveAssignment } from '../../../service/AssignmentService';
import { assignmentSliceActions, RootState } from '../../../redux/store';
import IQuizQuestion from '../../../types/props/IQuizQuestion';
import IAssignment from '../../../types/IAssignment';
import IHangmanQuestion from '../../../types/props/IHangmanQuestion';
import { buildItem, getCustomGameForm } from './GameCreationFactory';
import IMemoryMatch from '../../../types/props/IMemoryMatch';

const QuizCreator = ({ gameId }: { gameId: number }) => {

  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [items, setItems] = useState<IQuizQuestion[] | IHangmanQuestion[] | IMemoryMatch[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    const request = {
      assignmentName: data.assignmentName,
      attempts: data.attempts,
      questions: [...items],
      courseId: contextId,
      gameId: gameId,
      requiredAssignmentId: null
    };

    if (data.requiredAssignmentId != '') {
      request.requiredAssignmentId = data.requiredAssignmentId;
    }

    saveAssignment(request).then(async (response) => {
      dispatch(assignmentSliceActions.saveAssignment({
        id: response.data.id,
        name: response.data.name,
        gameId: response.data.gameId
      }));
      setItems([]);
      reset();
      toast.success('Assignment Saved!');
    }).catch((error) =>
      toast.error(error.message)
    );
  };

  const deleteItem = (index: number) => {
    const newItems = (items as never[]).filter((q: unknown, i: number) => i != index);
    setItems([...newItems]);
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
              className={(errors['attempts'] != null) ? styles.isInvalidField + ' ' + styles.fullWidth : styles.fullWidth} {...register('attempts', { required: true })}
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
        {(<div className={styles.cardsContainer}> {items.map((item, id) =>
          buildItem({item, deleteQuestion: deleteItem, gameId, id })
        )}
        </div>)}

        <div className={styles.button} onClick={() => setShowModal(true)}>Add question</div>
        <input className={styles.button + ' ' + styles.atTheEnd} value='Create' type='submit'
               disabled={items.length == 0} />
      </form>
      {showModal ? (<> <div className={styles.overlay}></div>
        {getCustomGameForm({items, setShowModal: setShowModal, setItems, gameId })} </>) : null}
    </>
  );
};

export default QuizCreator;
