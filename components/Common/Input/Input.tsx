import classes from './Input.module.scss';

const Input = (props: any) => {
  return <div className={classes.input}>{props.children}</div>;
};

export default Input;
