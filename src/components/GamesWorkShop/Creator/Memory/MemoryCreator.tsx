import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './MemoryCreator.module.scss';
import { saveMemoryAssignment } from '../../../../service/AssignmentService';
import { assignmentSliceActions, RootState } from '../../../../redux/store';
import IAssignment from '../../../../types/IAssignment';
import IMemoryMatch from '../../../../types/props/IMemoryMatch';
import MemoryForm from './MemoryForm';
import MemoryAnswerType from '../../../../types/enums/MemoryAnswerType';
import LoadingSpinner from '../../../Common/Spinner/Spinner';

const MemoryCreator = ({ gameId }: { gameId: number }) => {

  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignment);
  const { contextId } = useSelector((state: RootState) => state.auth);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [items, setItems] = useState<object[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = (data: any) => {
    setIsLoading(true);
    const formData = new FormData();

    items.forEach((item) => {
      if (item.type === MemoryAnswerType.IMAGE) {
        formData.append('files', item.secondMatch);
      }
    });

    formData.append('assignmentName', data.assignmentName);
    formData.append('attempts', data.attempts);
    formData.append('courseId', contextId);
    formData.append('gameId', gameId.toString());

    const newArray = items.map(({secondMatch, ...keepAttrs}) => {
      if (keepAttrs.type === MemoryAnswerType.IMAGE) {
        return keepAttrs;
      } else {
        return {secondMatch, ...keepAttrs};
      }
    });

    console.table(formData);
    const request = {
      assignmentName: data.assignmentName,
      attempts: data.attempts,
      questions: [...items],
      courseId: contextId,
      gameId: gameId,
      requiredAssignmentId: null
    };

    formData.set('questions',  JSON.stringify(newArray));

    if (data.requiredAssignmentId != '') {
      formData.set('requiredAssignmentId', data.requiredAssignmentId);
      request.requiredAssignmentId = data.requiredAssignmentId;
    }

    saveMemoryAssignment(formData).then(async (response) => {
      dispatch(assignmentSliceActions.saveAssignment({
        id: response.data.id,
        name: response.data.name,
        gameId: response.data.gameId
      }));
      setItems([]);
      reset();
      setIsLoading(false);
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
              type='number' min={1} max={20}
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
        {(<div className={styles.cardsContainer}> {items.map((item: any, id) => {
            return (<div className={styles.card} key={(item?.firstMatch)}>
              {(item?.firstMatch)}<span
              className={styles.delete}
              onClick={() => deleteItem(id)}>X</span>
            </div>);
          }
        )}
        </div>)}

        <div className={styles.button} onClick={() => setShowModal(true)}>Add question</div>
        <input className={styles.button + ' ' + styles.atTheEnd} value='Create' type='submit'
               disabled={items.length == 0} />
      </form>
      {showModal ? (<> <div className={styles.overlay}></div>
        {<MemoryForm items={items} setItems={setItems} setShowModal={setShowModal} />} </>) : null}
      {(!isLoading) ? null :  <><div className={styles.overlay}></div><LoadingSpinner/></>}
    </>
  );
};

export default MemoryCreator;
