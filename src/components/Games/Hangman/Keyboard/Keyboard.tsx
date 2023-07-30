import { KEYS } from '../../../../types/consts/Keys';
import styles from './Keyboard.module.scss';

interface KeyboardProps {
  checkLetter: (key: string) => void;
  isFinished: boolean;
}

const keyAudio = new Audio('/static/audios/key.mp3');

const playAudio = function () {
  void keyAudio.play();
};

const Keyboard = (props: KeyboardProps) => {
  return (
    <div className={styles.keyboard}>
      {KEYS.map((key) => {
        return (
          <button
            key={key}
            className={styles.key + ' ' + 'disabled'}
            disabled={props.isFinished}
            onClick={() => {
              props.checkLetter(key);
              playAudio();
            }}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;
