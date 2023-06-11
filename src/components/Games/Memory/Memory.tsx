import styles from './Memory.module.scss';
import { useEffect, useRef, useState } from 'react';
import { getRun } from '../../../service/RunService';
import { setLTIScore } from '../../../service/ScoreService';
import toast from 'react-hot-toast';
import IBoardProps from '../../../types/props/IBoardProps';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const shuffle = function(array: FlipCard[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

interface FlipCard {
  id: number;
  match: string;
  unclickable?: boolean;
}

const Memory = ({ assignmentId, gameId }: IBoardProps) => {

  const { userId } = useSelector((state: RootState) => state.auth);
  const [cards, setCards] = useState<FlipCard[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [selectedCards, setSelectedCards] = useState<FlipCard[]>([]);
  const [score, setScore] = useState<number>(0);
  const dataFetchedRef = useRef(false);
  const [canFlipCards, setCanFlipCards] = useState<boolean>(true);

  useEffect(() => {
    if (dataFetchedRef.current) {
      const data = {
        assignmentId, userId: userId, gameId
      };

      getRun(data).then(async (data) => {
        setCards(shuffle(data.game_data.info.cards));
      }).catch((error) =>
        toast.error(error.message));
    } else {
      dataFetchedRef.current = true;
    }

  }, []);

  useEffect(() => {
    if (selectedCards.length !== 0 && selectedCards.length === cards.length && selectedCards.every(s => s.unclickable)) {
      setLTIScore({ assignmentId, userId, gameId, failedAttempts, 'totalMatches': cards.length / 2 })
        .then((data) => {
          setScore(data.score);
        });
    }
  }, [selectedCards.length]);

  const getCardClasses = function(x: FlipCard, selectedIndexes: FlipCard[]) {
    const elem = selectedIndexes.find((y) => x.id === y.id && x.match == y.match);
    let classes = styles['flip-card'] + ' ';
    if (elem !== undefined) {
      classes += styles['flip-card-click'] + ' ' + (elem?.unclickable === true ? styles.unclickable : null);
    }

    if (!canFlipCards) classes += ' ' + styles.unclickable;
    return classes;
  };

  const clickHandler = function(card: FlipCard) {
    const audio = new Audio('/static/audios/flip_card.mp3');
    audio.volume = 0.2;
    void audio.play();

    setSelectedCards((prev) => [...prev, { 'id': card.id, 'match': card.match }]);
    if (selectedCards.length % 2 != 0) {
      setCanFlipCards(false);
      const selectedCard = selectedCards[selectedCards.length - 1];
      if (selectedCard.id === card.id && selectedCard.match != card.match) {
        setSelectedCards((prev) => prev.map(x => {
          return { ...x, 'unclickable': true };
        }));
        const audio = new Audio('/static/audios/won.mp3');
        audio.volume = 0.2;
        void audio.play();
        setCanFlipCards(true);
      } else {
        setTimeout(() => setSelectedCards((prev) => {
            if (selectedCard.id != card.id) {
              setFailedAttempts(prev => prev + 1);
            }
            setCanFlipCards(true);
            return [...prev.filter(p => p.unclickable === true)];
          }
        ), 600);
      }
    }
  };

  return <>
    <div className={styles.counter}>{'Failed Attempts: ' + failedAttempts + ' Score: ' + score}</div>
    <div className={styles['cards-grid']}>{cards.map((card) => {

      return <div className={getCardClasses(card, selectedCards)} key={card.id + card.match}
                  onClick={() => clickHandler(card)}>
        <div className={styles['flip-card-inner'] + ' ' + styles['flip-card-inner-click']}>
          <div className={styles['flip-card-front']}>
          </div>
          <div className={styles['flip-card-back']}>
            {card.match}
          </div>
        </div>
      </div>;
    })}</div>
  </>;
};

export default Memory;
