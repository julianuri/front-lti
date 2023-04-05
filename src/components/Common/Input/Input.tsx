import styles from './Input.module.scss';

const Input = (props: any) => {
	return <div className={styles.input}>{props.children}</div>;
};

export default Input;
