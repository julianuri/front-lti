import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './QuizCreator.module.scss';
import QuizQuestionForm from './QuestionForm/QuizQuestionForm';
import { saveAssignment } from '../../../../service/AssignmentService';


const QuizCreator = (props) => {

    const { contextId } = useSelector((state) => state.auth);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [questions, setQuestions] = useState([]);
    const [showQuestionModal, setQuestionModal] = useState(false);

    const onSubmit = (data: any) => {

      const request = {
        assignmentName: data.assignmentName,
        questions: [...questions],
        courseId: contextId,
        gameId: props.gameId
      };

      console.table(data);

      saveAssignment(request).then(async () => {
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
          <div>
            <label>Assignment Name</label>
            <input type='text'
                   className={errors.assignmentName ? 'form-control ' + styles.isInvalid : 'form-control'} {...register('assignmentName', { required: true })} />
            {errors.assignmentName && 'Assignment name is required'}
          </div>

          <div onClick={() => setQuestionModal(true)}>Add question</div>


          <input value='Create' type='submit' disabled={questions.length == 0} />
        </form>
        {showQuestionModal ?
          <QuizQuestionForm questions={questions} setQuestions={setQuestions} setShowModal={setQuestionModal} /> : null}
        <div>Questions:</div>
        {questions.map((question, index) => {
          return (<>
            <div key={index}>{question.question} <span className={styles.delete}
                                                       onClick={() => deleteQuestion(index)}>X</span></div>
          </>);
        })}
      </>
    );
  }
;

export default QuizCreator;
