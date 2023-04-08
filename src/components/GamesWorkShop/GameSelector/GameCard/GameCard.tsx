import classes from './GameCard.module.scss';

interface IGameCard {
  id: number,
  name: string,
  setGame: (game: {id: number, name: string}) => void
}

const GameCard = ({ id, name, setGame }: IGameCard) => {
  return (
    <div className={classes.card} onClick={() => setGame({ id, name })}>
      <div>{name}</div>
    </div>
  );
};

export default GameCard;
