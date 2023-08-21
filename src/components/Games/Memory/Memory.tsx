import styles from './Memory.module.scss';
import { useEffect, useRef, useState } from 'react';
import { getRun } from '../../../service/RunService';
import { setLTIScore } from '../../../service/ScoreService';
import IBoardProps from '../../../types/props/IBoardProps';
import { useDispatch, useSelector } from 'react-redux';
import { assignmentSliceActions, RootState } from '../../../redux/store';
import MemoryAnswerType from '../../../types/enums/MemoryAnswerType';
import { notifications } from '@mantine/notifications';
import { Paper, Rating } from '@mantine/core';

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
  type: number;
  unclickable?: boolean;
  selected?: boolean;
}

const Memory = ({ assignmentId, gameId }: IBoardProps) => {

  const { userId, sessionId, launchId } = useSelector((state: RootState) => state.auth);
  const [cards, setCards] = useState<FlipCard[]>([]);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [selectedCards, setSelectedCards] = useState<FlipCard[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const dataFetchedRef = useRef(false);
  const [canFlipCards, setCanFlipCards] = useState<boolean>(true);
  const [stars, setStars] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (dataFetchedRef.current || process.env.NODE_ENV !== 'development') {
      getUpdatedRun(false);
    }
    return () => {
      dataFetchedRef.current = true;
    };
  }, [failedAttempts]);

  const getUpdatedRun = function(updateAnswer: boolean) {
    const data = {
      assignmentId,
      userId: userId,
      gameId,
      failedAttempts: failedAttempts,
      answers: (updateAnswer) ? [...new Set([...selectedCards.map((card) => card.id)])] : []
    };
    getRun(data)
      .then(async (data) => {
        const selected = data.game_data.info.cards
          .filter((card: FlipCard) => data.run.user_input.answers.includes(card.id))
          .map((card: FlipCard) => {
            return { ...card, unclickable: true };
          });
        setFailedAttempts(data.run.user_input.failed_attempts);
        setSelectedCards(selected);
        if (cards.length === 0) {
          setCards(shuffle(data.game_data.info.cards));
        }
      })
      .catch((error) => notifications.show({ message: error.message, autoClose: false, color: 'red' }));
  };

  useEffect(() => {
    if (
      selectedCards.length !== 0 &&
      selectedCards.length === cards.length &&
      selectedCards.every(s => s.unclickable)
    ) {
      setLTIScore({
        assignmentId,
        userId,
        gameId,
        failedAttempts,
        'totalMatches': cards.length / 2,
        sessionId,
        launchId
      }).then((data) => {
        setScore(data.score);
        setStars(data.score / 20);
        dispatch(assignmentSliceActions.saveLaunchedAssignment({
          launchedAssignmentId: 0,
          launchedGameId: 0
        }));
      });
    }
  }, [selectedCards.length]);

  const getCardClasses = function(x: FlipCard, selectedIndexes: FlipCard[]) {
    const elem = selectedIndexes.find(
      (y) => x.id === y.id && x.match == y.match
    );
    let classes = styles['flip-card'] + ' ';
    if (elem !== undefined) {
      classes +=
        styles['flip-card-click'] +
        ' ' +
        (elem?.unclickable === true ? styles.unclickable : null);
    }

    if (!canFlipCards) classes += ' ' + styles.unclickable;
    return classes;
  };

  const clickHandler = function(card: FlipCard) {
    const audio = new Audio('/static/audios/flip_card.mp3');
    audio.volume = 0.2;
    void audio.play();

    setSelectedCards((prev) => [...prev, { id: card.id, match: card.match }]);
    if (selectedCards.length % 2 != 0) {
      setCanFlipCards(false);
      const selectedCard = selectedCards[selectedCards.length - 1];
      if (selectedCard.id === card.id && selectedCard.match != card.match) {
        setSelectedCards((prev) =>
          prev.map((x) => {
            return { ...x, unclickable: true };
          })
        );
        const audio = new Audio('/static/audios/won.mp3');
        audio.volume = 0.2;
        void audio.play();
        getUpdatedRun(true);
        setCanFlipCards(true);
      } else {
        setTimeout(
          () =>
            setSelectedCards((prev) => {
              if (selectedCard.id != card.id) {
                setFailedAttempts((prev) => prev + 1);
              }
              setCanFlipCards(true);
              return [...prev.filter((p) => p.unclickable === true)];
            }),
          600
        );
      }
    }
  };

  return (
    <Paper styles={{
      title: { color: '#228be6', fontWeight: 'bold' }
    }} style={{
             display: 'flex',
             minHeight: '100%',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             gap: '1rem',
             padding: '1rem'
           }}>
      {score != null ? (
          <div className={styles.scoreSection}>
            <div> Conseguiste {score} de {100}</div>
            <Rating fractions={10} value={stars} readOnly />
          </div>
        ) :
        <div className={styles['cards-grid']}>
          {cards.map((card) => {
            return (
              <div
                className={getCardClasses(card, selectedCards)}
                key={card.id + card.match}
                onClick={() => clickHandler(card)}
              >
                <div
                  className={
                    styles['flip-card-inner'] +
                    ' ' +
                    styles['flip-card-inner-click']
                  }
                >
                  <div className={styles['flip-card-front']}></div>
                  {card.type === MemoryAnswerType.TEXT ? (
                    <div className={styles['flip-card-back']}>{card.match}</div>
                  ) : (
                    <div className={styles['flip-card-back']}>
                      <img src={card.match} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>}
    </Paper>
  );
};

export default Memory;
