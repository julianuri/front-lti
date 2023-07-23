import styles from './HangmanForm.module.scss';
import { useForm } from 'react-hook-form';
import IHangmanQuestion from '../../../../types/props/IHangmanQuestion';

interface HangmanFormProps {
  items: IHangmanQuestion[]
  setItems: (words: IHangmanQuestion[]) => void
  setShowModal: (showModal: boolean) => void
}

const HangmanForm = ({ items, setItems, setShowModal }: HangmanFormProps) => {
  const options = [{ name: 'word', index: 0 }, { name: 'clue', index: 1 }];


  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    const newData = {
      wordToGuess: data.word.toUpperCase(),
      order: items.length,
      clue: data.clue,
    };

    setItems([...items, { ...newData }]);
    setShowModal(false);
  };

  return (
    <div className={styles.modal}>
      <div><span className={styles.delete} onClick={() => setShowModal(false)}>X</span></div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>


        {options.map(option => {
          return (
            <div key={option.index} className={styles.fullRow}>
              <label>{option.name}</label>
              <div>
                <input
                  type='text'
                  className={(errors[option.name] != null) ? styles.isInvalidField : undefined} {...register(option.name, { required: true })}
                />
              </div>
            </div>
          );
        })}

        <input className={styles.button} value='Create' type='submit' />
      </form>
    </div>
  );
};

export default HangmanForm;
