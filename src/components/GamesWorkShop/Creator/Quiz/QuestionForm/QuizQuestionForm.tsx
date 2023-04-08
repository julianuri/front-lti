import styles from './QuizQuestionForm.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import IQuizQuestion from '../../../../../types/props/IQuizQuestion';

interface QuestionFormProps {
  questions: IQuizQuestion[]
  setQuestions: (questions: IQuizQuestion[]) => void
  setShowModal: (showModal: boolean) => void
}

const QuizQuestionForm = ({ questions, setQuestions, setShowModal }: QuestionFormProps) => {

  const [checkedIndex, setCheckedIndex] = useState<number>(-1);
  const options = [{ name: 'first', index: 0 }, { name: 'second', index: 1 }, { name: 'third', index: 2 },
    { name: 'fourth', index: 3 }];

  const schema = yup.object().shape({
    checkbox: yup.array().min(1),
    question: yup.string().required(),
    firstOption: yup.string().required(),
    secondOption: yup.string().required(),
    thirdOption: yup.string().required(),
    fourthOption: yup.string().required()
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });


  const onSubmit = (data: any) => {
    const newData = {
      question: data.question,
      options: [{ option: data.firstOption },
        { option: data.secondOption },
        { option: data.thirdOption },
        { option: data.fourthOption }],
      order: questions.length,
      answer: checkedIndex
    };

    setQuestions([...questions, { ...newData }]);
    setShowModal(false);
  };

  const checkBoxChange = (index: any) => {
    if (!index.checked) {
      setCheckedIndex(-1);
    } else {
      setCheckedIndex(Number(index.value));
    }
  };

  return (
    <div className={styles.modal}>
      <div><span className={styles.delete} onClick={() => setShowModal(false)}>X</span></div>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

        <div className={styles.fullRow}>
          <label>Enter question</label>
          <input
            type='text'
            className={(errors.question != null) ? 'question ' + styles.isInvalidField : 'question'} {...register('question', { required: true })}
          />

        </div>
        {options.map(option => {
          return (
            <div key={option.index} className={styles.option}>
              <label>{option.name} option</label>
              <div>
                <input
                  type='text'
                  className={(errors[option.name + 'Option'] != null) ? styles.isInvalidField : undefined} {...register(option.name + 'Option', { required: true })}
                />
                <input
                  className={(errors.checkbox != null) ? styles.isInvalidCheckBox : undefined}
                  disabled={checkedIndex != -1 && checkedIndex != option.index}
                  type='checkbox' {...register('checkbox', { onChange: (e) => checkBoxChange(e.target) })}
                  value={option.index}
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

export default QuizQuestionForm;
