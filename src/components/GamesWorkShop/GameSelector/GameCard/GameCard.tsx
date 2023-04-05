import classes from './GameCard.module.scss';
import IGameCard from '../../../../types/props/IGameCardProps';

const GameCard = ({ id, name, setGame }: IGameCard) => {
  return (
    <div className={classes.card} onClick={() => setGame({ id, name })}>
      <div>{name}</div>
    </div>
  );
};

export default GameCard;
