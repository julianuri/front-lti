import styles from './Dice.module.scss';

const Pip = () => <span className={styles.pip} />;

const Face = ({ children }) => <div className={styles.face}>{children}</div>;

const Die = ({ value }) => {
  const pips = Number.isInteger(value)
    ? Array(value)
        .fill(0)
        .map((_, i) => <Pip key={i} />)
    : null;
  return <Face>{pips}</Face>;
};

export default Die;
