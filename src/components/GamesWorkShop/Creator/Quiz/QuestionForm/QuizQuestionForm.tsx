import { useForm } from 'react-hook-form';
import styles from './QuizQuestionForm.module.scss';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import QuestionFormProps from '../../../../../types/QuestionFormProps';

const QuizQuestionForm = ({ questions, setQuestions, setShowModal }: QuestionFormProps) => {
	const [checkedIndex, setCheckedIndex] = useState(-1);
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
			answers: [{ option: data.firstOption },
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
			setCheckedIndex(index.value);
		}
	};

	return (
		<div className={styles.modal}>
			<div>Question: <span className={styles.delete} onClick={() => setShowModal(false)}>X</span></div>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

				<div className={styles.question}>
					<label>Enter question:</label>
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
									className={(errors[option.name + 'Option'] != null) ? 'form-control ' + styles.isInvalidField : 'form-control'} {...register(option.name + 'Option', { required: true })}
								/>
								<input
									className={(errors.checkbox != null) ? styles.isInvalidCheckBox : 'empty'}
									disabled={checkedIndex != -1 && checkedIndex != option.index}
									type='checkbox' {...register('checkbox', { onChange: (e) => checkBoxChange(e.target) })}
									value={option.index}
								/>
							</div>
						</div>
					);
				})}

				<input value='Create' type='submit' />
			</form>
		</div>
	);
};

export default QuizQuestionForm;