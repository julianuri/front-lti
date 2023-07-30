import styles from './HangmanDrawing.module.scss';

const HangmanDrawing = (props: any) => {
  const head = <div key={'head'} className={styles.head} />;
  const body = <div key={'body'} className={styles.body} />;
  const leftArm = <div key={'leftArm'} className={styles.leftArm} />;
  const leftLeg = <div key={'leftLeg'} className={styles.leftLeg} />;
  const rightArm = <div key={'rightArm'} className={styles.rightArm} />;
  const rightLeg = <div key={'rightLeg'} className={styles.rightLeg} />;

  const fullBody = [head, body, leftArm, rightArm, leftLeg, rightLeg];

  return (
    <div className={styles.hangmanContainer}>
      {fullBody.map((bodyPart, index) => {
        return props.mistakes > index ? bodyPart : null;
      })}
      <div className={styles.rope} />
      <div className={styles.top} />
      <div className={styles.stick} />
      <div className={styles.floor} />
    </div>
  );
};

export default HangmanDrawing;
