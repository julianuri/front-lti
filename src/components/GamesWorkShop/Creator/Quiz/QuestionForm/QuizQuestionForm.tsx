import { useForm } from 'react-hook-form';
import styles from './QuizQuestionForm.module.scss';


const QuizQuestionForm = (props) => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data: any) => {
    const newData = {
      'question': data.question,
      'answers': [{ 'option': data.firstOption },
        { 'option': data.secondOption },
        { 'option': data.thirdOption },
        { 'option': data.fourthOption }],
      'order': props.questions.length,
      'answer': data.answer - 1
    };

    props.setQuestions([...props.questions, { ...newData }]);
    props.setShowModal(false);
  };

  return (
    <div className={styles.modal}>
      <div>Question: <span className={styles.delete} onClick={() => props.setShowModal(false)}>X</span></div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

        <div className={styles.question}>
          <label>Enter question:</label>
          <input type='text'
                 className={errors.question ? 'question ' + styles.isInvalid : 'question'} {...register('question', { required: true })} />
          {errors.question && 'Question is required'}

        </div>
        <div className={styles.first}>
          <label>First option:</label>
          <input type='text'
                 className={errors.firstOption ? 'form-control ' + styles.isInvalid : 'form-control'} {...register('firstOption', { required: true })} />
          {errors.firstOption && 'First option is required'}
        </div>
        <div className={styles.second}>
          <label>Second option:</label>
          <input type='text'
                 className={errors.secondOption ? 'form-control ' + styles.isInvalid : 'form-control'} {...register('secondOption', { required: true })} />
          {errors.secondOption && 'Second option is required'}
        </div>
        <div className={styles.third}>
          <label>Third option:</label>
          <input type='text'
                 className={errors.thirdOption ? 'form-control ' + styles.isInvalid : 'form-control'} {...register('thirdOption', { required: true })} />
          {errors.thirdOption && 'Third option is required'
          }
        </div>
        <div className={styles.fourth}>
          <label>Fourth option:</label>
          <input type='text'
                 className={errors.fourthOption ? 'form-control ' + styles.isInvalid : 'form-control'} {...register('fourthOption', { required: true })} />
          {errors.fourthOption && 'Fourth option is required'}
        </div>

        <div>
          <label>Enter right answer number</label>
          <input type='number' min={1} max={4}
                 className={errors.answer ? 'form-control ' + styles.isInvalid : 'form-control'} {...register('answer', { required: true })} />
          {errors.answer && 'Right answer is required'}
        </div>

        <input value='Create' type='submit' />
      </form>

    </div>)
    ;
};

export default QuizQuestionForm;
