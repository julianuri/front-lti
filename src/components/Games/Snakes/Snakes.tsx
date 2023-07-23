import IBoardProps from '../../../types/props/IBoardProps';
import styles from './Snakes.module.scss';
import { useEffect, useRef, useState } from 'react';
import DirectionEnum from '../../../types/enums/DirectionEnum';
import OrderEnum from '../../../types/enums/OrderEnum';
import Die from './Dice/Dice';
import Link from 'next/link';
import SnakeCard from './Question/SnakeCard';
import { getRun } from '../../../service/RunService';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { getRandomQuestion } from '../../../service/QuestionService';
import ISnakeQuestion from '../../../types/props/ISnakeQuestion';
import { setLTIScore } from '../../../service/ScoreService';

type BoardData = {
  path: string,
  tiles_per_row: number,
  tiles_per_column: number,
  rem_per_tile: number,
  interactive_objects: {
    initialPosition: number,
    finalPosition: number,
    direction: number,
    yMovement: number,
    xMovement: number}[]
};

const Snakes = ({ assignmentId, gameId }: IBoardProps) => {


  const { userId } = useSelector((state: RootState) => state.auth);
  const [boardData, setBoardData] = useState<BoardData>({tiles_per_row: -1, tiles_per_column: 1, rem_per_tile: 4});
  const [hasWon, setHasWon] = useState(false);
  const [ROLLS_TO_SHOW_QUESTION, setRollsToShowQuestion] = useState<number>(0);
  const [diceNumber, setDiceNumber] = useState(1);
  const [isDiceClickable, setIsDiceClickable] = useState(false);
  const [position, setPosition] = useState( 1);
  const [player, setPlayer] = useState({ userId: 37778, color: 'white' });
  const [direction, setDirection] = useState( DirectionEnum.RIGHT );
  const [horizontalCoordinate, setHorizontalCoordinate] = useState<number>(0);
  const [verticalCoordinate, setVerticalCoordinate] = useState<number>(0);
  const [rollsLeft, setRollsLeft] = useState(ROLLS_TO_SHOW_QUESTION);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [questionType, setQuestionType] = useState<ISnakeQuestion>({id: 0, options: [{option: 'saaaaaaaaaaaa'}], question: 'Sample' });
  const [answer, setAnswer] = useState({id: -1, answerIndex: -1});
  const dataFetchedRef = useRef(false);
  const shouldUpdatePositionRef = useRef(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (showModal) {
      const data = {
        assignmentId, userId, gameId
      };

      getRandomQuestion(data).then(async (data: any) => {
        setQuestionType({ id: data.id, options: data.options, question: data.question });
      }).catch((error) =>
        toast.error(error.message));
    }

  }, [showModal]);

  useEffect(() => {
    if (shouldUpdatePositionRef.current && position != 1 && isDiceClickable) {
      const userPosition = {
        x: horizontalCoordinate,
        y: verticalCoordinate,
        position: position,
        direction: direction,
        rollsLeft: rollsLeft - 1 === 0 ? ROLLS_TO_SHOW_QUESTION : rollsLeft - 1,
      };

      const data = {
        assignmentId, userId, gameId, userPosition
      };

      getRun(data).catch((error) =>
        toast.error(error.message));
    }

  }, [isDiceClickable]);

  useEffect(() => {
    callRunService();
  }, [answer, hasWon]);

  const callRunService = function() {
    if (dataFetchedRef.current) {
      const request = {
        assignmentId, userId, gameId, answer
      };

      getRun(request).then(async (data) => {
        if (position !== 100) {
          setBoardData(data.board_data);
          setHorizontalCoordinate(data.run.user_input.x);
          setVerticalCoordinate(data.run.user_input.y);
          setDirection(data.run.user_input.direction);
          setPosition(data.run.user_input.position);
          setIsDiceClickable(true);
          setRollsToShowQuestion(data.game_data.info.rolls_to_show_question);
          setRollsLeft(data.run.user_input.rolls_left);
        } else {
          setLTIScore(request).then(async (data) => {
            setScore(data.score);
          }).catch((error) =>
            toast.error(error.message));
        }
      }).catch((error) =>
        toast.error(error.message));
    } else {
      dataFetchedRef.current = true;
    }
  };

  const shouldIncreaseRow = function(prev: number, steps: number): boolean {
    const surpassesBoardLimit = boardData.tiles_per_row * boardData.tiles_per_column < prev + steps;
    if (surpassesBoardLimit) {
      return false;
    }

    return ((Math.floor(prev / boardData.tiles_per_row) < Math.floor((prev + steps) / boardData.tiles_per_row) ||
      (prev % boardData.tiles_per_row) === 0) && (prev + steps) % boardData.tiles_per_row !== 0);
  };

  const realClickHandler = (steps: number) => {
    const surpassesBoardLimit = boardData.tiles_per_row * boardData.tiles_per_column < position + steps;
    const currentPosition = position;

    if (surpassesBoardLimit) {
      const leftOverX = boardData.tiles_per_row - (position % boardData.tiles_per_row);
      setPosition(position + leftOverX - (steps - leftOverX));
    } else {
      setPosition(position + steps);
    }

    movePlayer(steps, currentPosition, direction);
  };

  const handleInteractiveObject = function(position: number, steps: number) {
    const leftOverX = boardData.tiles_per_row - (position % boardData.tiles_per_row);
    return boardData.interactive_objects.find(x => {
      const surpassesBoardLimit = boardData.tiles_per_row * boardData.tiles_per_column < position + steps;
      if (surpassesBoardLimit) {
        return x.initialPosition === position + steps || x.initialPosition === position + leftOverX - (steps - leftOverX);
      }

      return x.initialPosition === position + steps;
    });
  };

  const movePlayer = function(steps: number, position: number, direction: number) {

    if (shouldIncreaseRow(position, steps)) {
      if (position % boardData.tiles_per_row !== 0) changeDirection();
      setTimeout(() => {
          setVerticalCoordinate((current) => current + ((-1) * boardData.rem_per_tile));
        },
        (position % boardData.tiles_per_row === 0) ? OrderEnum.FAST : OrderEnum.NORMAL);
      increaseXAxisWhenIncreasingRow(position, steps, direction);

    } else {

      const surpassesBoardLimit = boardData.tiles_per_row * boardData.tiles_per_column < position + steps;
      if (surpassesBoardLimit) {
        const leftOverX = boardData.tiles_per_row - (position % boardData.tiles_per_row);
        setTimeout(() => {
          setHorizontalCoordinate((current) => current + (boardData.rem_per_tile * direction * leftOverX));
        }, OrderEnum.FASTEST);
        steps = steps - leftOverX;
        setTimeout(function() {
          setHorizontalCoordinate((current) => current + ((-1) * (boardData.rem_per_tile * direction) * (steps)));
        }, OrderEnum.SLOW);
      } else {
        if ((position + steps) % boardData.tiles_per_row === 0) {
          changeDirection();
        }
        setHorizontalCoordinate((current) => current + ((boardData.rem_per_tile * direction) * (steps)));
      }

    }
  };

  const increaseXAxisWhenIncreasingRow = function(position: number, steps: number, direction: number) {
    const leftOverX = boardData.tiles_per_row - (position % boardData.tiles_per_row);
    //WHEN YOUR NEXT STOP IS HIGHER THAN THE FIRST TILE OF THE NEXT ROW
    //AND YOUR CURRENT TILE IS NOT THE LAST ONE OF THE CURRENT ROW
    if ((position + steps) % boardData.tiles_per_row > 1 && leftOverX != boardData.tiles_per_row) {
      setTimeout(() => {
        setHorizontalCoordinate((current) => current + ((boardData.rem_per_tile * direction) * (leftOverX)));
      }, OrderEnum.FASTEST);
      steps = steps - leftOverX;
      setTimeout(function() {
        setHorizontalCoordinate((current) => current + ((-1) * (boardData.rem_per_tile * direction) * (steps - 1)));
      }, OrderEnum.SLOW);
    } else {
      setTimeout(() => {
        setHorizontalCoordinate((current) => current + ((boardData.rem_per_tile * direction) * (steps - 1)));
      }, (position % boardData.tiles_per_row === 0) ? OrderEnum.NORMAL : OrderEnum.FAST);
    }
  };

  const changeDirection = function() {
    setDirection(direction === DirectionEnum.LEFT ? DirectionEnum.RIGHT : DirectionEnum.LEFT);
  };

  const diceHandler = () => {
    if (isDiceClickable) {
      shouldUpdatePositionRef.current = true;
      setIsDiceClickable(false);
      const diceNumber = Math.floor(Math.random() * 6 + 1);
      /*if (position === 1) diceNumber = 3;
      if (position === 68) diceNumber = 3;
      if (position === 92) diceNumber = 3;
      if (position === 95) diceNumber = 5;*/
      const currentPosition = position;

      setDiceNumber(diceNumber);
      realClickHandler(diceNumber);

      const interactiveObject = handleInteractiveObject(currentPosition, diceNumber);
      if (interactiveObject !== undefined) {
        setTimeout(() => {
          setVerticalCoordinate((current) => current + ((-1) * boardData.rem_per_tile * interactiveObject.yMovement));
          setHorizontalCoordinate((current) => current + (boardData.rem_per_tile * interactiveObject.xMovement));
          setDirection(interactiveObject.direction);
          setPosition(interactiveObject.finalPosition);
        }, OrderEnum.SLOWER);
      }

      if (currentPosition + diceNumber === boardData.tiles_per_column * boardData.tiles_per_row && rollsLeft > 1) {
        setHasWon(true);
      } else {
        setTimeout(() => setIsDiceClickable(true), OrderEnum.SLOWEST);
      }

      setTimeout(() => {
        setRollsLeft((current) => current - 1);
        if (rollsLeft === 1) {
          setShowModal(true);
        }
      }, OrderEnum.SLOWEST * 1.1);

    }
  };

  useEffect(() => {
    if (!showModal && rollsLeft <= 0) {
      setRollsLeft(ROLLS_TO_SHOW_QUESTION);

      if (position === boardData.tiles_per_column * boardData.tiles_per_row) {
        setHasWon(true);
      }
    }

  }, [showModal]);

  const handleAnswerOptionClick = (id: number, answerIndex: number) => {
    setAnswer({id, answerIndex});
    setShowModal(false);
  };

  return <div className={styles['main-container']} style={{ 'position': 'relative', 'display': 'grid' }}>

    <div className={styles.board}>
      <img style={{ 'height': boardData.rem_per_tile * boardData.tiles_per_column + 'rem' }}
           src={boardData.path} alt={'snake'} />
      <div>

        <div className={styles.chip} style={{
          'left': horizontalCoordinate + 'rem',
          'top': verticalCoordinate + 'rem',
          'backgroundColor': player.color
        }} />
      </div>
    </div>
    <div className={styles['dice-container']} onClick={diceHandler}>
      <Die key={diceNumber} value={diceNumber} />
    </div>
    {showModal ? (<>
      <div className={styles.overlay}></div>
      <SnakeCard question={questionType} handleAnswerOptionClick={handleAnswerOptionClick}/>
    </>) : null}
    {score != 0 ? <div className={styles.score}>Score<br/> {score} / 100</div> : <div className={styles['empty-score']}></div>}
    <Link className={styles.button} href='/student/assignments'>back</Link>
  </div>;
};

export default Snakes;
