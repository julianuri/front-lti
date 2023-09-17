import classes from './GameCard.module.scss';

interface IGameCard {
  id: number;
  name: string;
  description: string;
  setGame: (game: { id: number; name: string }) => void;
  svgImage: string;
}

import Image from 'next/image';
import { Carousel } from '@mantine/carousel';
import GamesNames from '../../../../types/consts/GamesNames';

const GameCard = ({ id, name, description, setGame, svgImage }: IGameCard) => {
  return (
    <Carousel.Slide className={classes['slide']} onClick={() => setGame({ id, name })}>
      <Image src={svgImage} alt={name} width={100} height={100} />
      <div className={classes['title']}>&nbsp;{GamesNames[name]}</div>
      <div>&nbsp;{description}</div>
    </Carousel.Slide>
  );
};

export default GameCard;
