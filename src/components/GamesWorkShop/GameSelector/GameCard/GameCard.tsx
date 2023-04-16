import classes from './GameCard.module.scss';

interface IGameCard {
  id: number,
  name: string,
  setGame: (game: {id: number, name: string}) => void
  svgImage: string
}

import Image from 'next/image';

const GameCard = ({ id, name, setGame, svgImage }: IGameCard) => {
  return (
    <div className={classes.card} onClick={() => setGame({ id, name })}>
      <Image src={svgImage} alt={'lolo'} width={100} height={100}/>
      <div>{name}</div>
    </div>
  );
};

export default GameCard;
