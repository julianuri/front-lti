import classes from './Form.module.scss';
import Input from '../Input/Input';
import { useForm } from 'react-hook-form';

const Form = ({ inputs, submit, buttonName, optionalLink }) => {
	const { register, handleSubmit, formState: { errors } } = useForm();

	return (
		<div className={classes.form_section}>
			<form className={classes.form} onSubmit={handleSubmit(submit)}>

				{inputs.map((input: any, index: number) => {
					return (
						<Input key={index}>
							<input
								{...register(`${input.name}`, { required: true })}
								className={(errors.email != null) ? classes.invalid : undefined}
								id={input.name}
								type={input.type}
								placeholder={`Enter ${input.name}`}
							/>
						</Input>
					);
				})}

				<input type='submit' value={buttonName} />
				{optionalLink}
			</form>
		</div>
	);
};

export default Form;
