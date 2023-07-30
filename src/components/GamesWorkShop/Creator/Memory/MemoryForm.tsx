import styles from './MemoryForm.module.scss';
import { useForm } from 'react-hook-form';
import IMemoryMatch from '../../../../types/props/IMemoryMatch';
import { useState } from 'react';
import MemoryAnswerType from '../../../../types/enums/MemoryAnswerType';
import { notifications } from '@mantine/notifications';

interface MemoryFormProps {
  items: IMemoryMatch[];
  setItems: (words: any[]) => void;
  setShowModal: (showModal: boolean) => void;
}

const MemoryForm = ({ items, setItems, setShowModal }: MemoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [answerType, setAnswerType] = useState<number>(MemoryAnswerType.TEXT);

  const onSubmit = (data: any) => {
    const newData = {
      id: items.length,
      firstMatch: data.Concept,
      secondMatch:
        answerType === MemoryAnswerType.TEXT ? data.Answer : data.Answer[0],
      fileName:
        answerType === MemoryAnswerType.IMAGE ? data.Answer[0].name : null,
      type: answerType,
    };

    setItems([...items, newData]);
    setShowModal(false);
  };

  const validFileSize = function (file: File) {
    return file.size <= 1_048_576;
  };

  const changeAnswerType = function () {
    if (answerType === MemoryAnswerType.TEXT) {
      setAnswerType(MemoryAnswerType.IMAGE);
    } else {
      setAnswerType(MemoryAnswerType.TEXT);
    }
  };

  const onFileChange = function (e) {
    if (e.target?.files && !validFileSize(e.target.files[0])) {
      notifications.show({ message: 'Imagen no debería pesar más de un mega', autoClose: 2000, color: 'red'});
      e.target.value = '';
    }
  };

  return (
    <div className={styles.modal}>
      <div>
        <span className={styles.delete} onClick={() => setShowModal(false)}>
          X
        </span>
      </div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fullRow}>
          <div className={styles['horizontal-row']}>
            <label>Answer Type</label>
            <label className="switch">
              <input type="checkbox" onChange={changeAnswerType} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className={styles.fullRow}>
          <label>Concept</label>
          <div>
            <input
              type="text"
              className={
                errors['Concept'] != null ? styles.isInvalidField : undefined
              }
              {...register('Concept', { required: true })}
            />
          </div>
        </div>

        {answerType === MemoryAnswerType.TEXT ? (
          <div className={styles.fullRow}>
            <label>Answer</label>
            <div>
              <input
                type="text"
                className={
                  errors['Answer'] != null ? styles.isInvalidField : undefined
                }
                {...register('Answer', { required: true })}
              />
            </div>
          </div>
        ) : (
          <div className={styles.fullRow}>
            <label>Answer</label>
            <div>
              <input
                type="file"
                accept="image/*"
                className={
                  errors['Answer'] != null ? styles.isInvalidField : undefined
                }
                {...register('Answer', {
                  onChange: (e) => onFileChange(e),
                  required: true,
                })}
              />
            </div>
          </div>
        )}

        <input className={styles.button} value="Create" type="submit" />
      </form>
    </div>
  );
};

export default MemoryForm;
