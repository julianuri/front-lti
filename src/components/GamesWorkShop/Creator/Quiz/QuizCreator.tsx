import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './QuizCreator.module.scss';
import QuizQuestionForm from './QuestionForm/QuizQuestionForm';
import { saveAssignment } from '../../../../service/AssignmentService';
import { assignmentSliceActions } from '../../../../redux/store';

const QuizCreator = ({ gameId }: { gameId: number }) => {

	const dispatch = useDispatch();
	const { contextId } = useSelector((state) => state.auth);
	const { register, handleSubmit, formState: { errors }, reset } = useForm();
	const [questions, setQuestions] = useState([]);
	const [showQuestionModal, setQuestionModal] = useState(false);

	const onSubmit = (data: any) => {
		const request = {
			assignmentName: data.assignmentName,
			attempts: data.attempts,
			questions: [...questions],
			courseId: contextId,
			gameId: gameId
		};

		saveAssignment(request).then(async (response) => {
			dispatch(assignmentSliceActions.saveAssignment({ id: response.data.id, name: response.data.name, gameId: response.data.gameId }));
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
						className={(errors.assignmentName != null) ? 'form-control ' + styles.isInvalidField : 'form-control'} {...register('assignmentName', { required: true })}
					/>
					{(errors.assignmentName != null) && 'Assignment name is required'}
				</div>
				<div className={styles.field}>
					<label>Attempts</label>
					<div>
						<input
							type='number' min={1} max={3}
							className={(errors['attempts'] != null) ? 'form-control ' + styles.isInvalidField : 'form-control'} {...register('attempts', { required: true })}
						/>
					</div>
				</div>
				<div className={styles.cardsContainer}> {questions.map((question, index) => {
					return (
						<>
							<div className={styles.card} key={index}>{question.question} <span
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

				<input value='Create' type='submit' disabled={questions.length == 0} />
			</form>
			{showQuestionModal
				? <QuizQuestionForm questions={questions} setQuestions={setQuestions} setShowModal={setQuestionModal} />
				: null}
		</>
	);
};

export default QuizCreator;
