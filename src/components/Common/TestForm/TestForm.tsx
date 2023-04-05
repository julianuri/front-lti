import classes from './TestForm.module.scss';
import { useForm } from 'react-hook-form';

const TestForm = ({ inputs, submit, buttonName, optionalLink }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (

    <form className={classes.form} onSubmit={handleSubmit(submit)}>

      {inputs.map((input: any, index: number) => {

        const row = () => {
          if (input.width == 'full-row') return 'fullRow';
          return '';
        };

        return (
          <div key={index} className={classes[row()]}>
            <label>{input.label}</label>

            <div>
              <input readOnly={input.readOnly}
                {...register(`${input.name}`, { required: true})}
                className={(errors[`${input.name}`] != null) ? classes.isInvalidField: undefined}
                id={input.name}
                type={input.type}
                placeholder={input.label}
              />
              {(input.checkbox != undefined) ? (<input
                className={(input.checkbox.checkedIndex == -1) ? classes.isInvalidCheckBox : 'empty'}
                disabled={input.checkbox.checkedIndex > -1 && input.checkbox.checkedIndex != input.checkbox.value}
                type='checkbox' {...register('checkbox', { onChange: (e) => input.checkbox.onChangeFunction(e.target) })}
                value={input.checkbox.value}
              />) : null}
            </div>

          </div>
        );
      })}

      <input className={classes.button} type='submit' value={buttonName}/>
      {optionalLink}
    </form>

  );
};

export default TestForm;
