import { KEYS } from '../../../../types/consts/Keys';
import styles from './Keyboard.module.scss';
import { useEffect, useState } from 'react';

interface KeyboardProps {
  checkLetter: (key: string) => void;
  isFinished: boolean;
  clickedLetters: string[];
}

const Keyboard = (props: KeyboardProps) => {

  const [audio, setAudio] = useState<any>(null);

  useEffect(() => {
    setAudio(new Audio('/static/audios/key.mp3'));
  }, []);

  const playAudio = function () {
    audio.play();
  };

  return (
    <div className={styles.keyboard}>
      {KEYS.map((key) => {
        return (

          <button
            key={key}
            className={(props.clickedLetters.includes(key)) ? styles.key + ' ' + 'disabled': styles.key}
            disabled={props.isFinished || (props.clickedLetters.includes(key))}
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
