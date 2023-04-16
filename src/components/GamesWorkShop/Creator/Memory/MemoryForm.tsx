import styles from './MemoryForm.module.scss';
import { useForm } from 'react-hook-form';
import IMemoryMatch from '../../../../types/props/IMemoryMatch';

interface MemoryFormProps {
  items: IMemoryMatch[]
  setItems: (words: IMemoryMatch[]) => void
  setShowModal: (showModal: boolean) => void
}

const MemoryForm = ({ items, setItems, setShowModal }: MemoryFormProps) => {

  const options = [{ name: 'first', index: 0 }, { name: 'second', index: 1 }];
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    const newData = {
      id: items.length,
      firstMatch: data.first,
      secondMatch: data.second,
    };
   // setItems([...items, { 'id': items.length, 'match': data.first}, { 'id': items.length, 'match': data.second}]);
    setItems([...items, newData]);
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

export default MemoryForm;
