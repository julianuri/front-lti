import classes from './GameCard.module.scss';

const GameCard = (props) => {
	return (
		<div className={classes.card} onClick={() => props.setGame({ name: props.game.name, id: props.game.id })}>
			<img
				src={props.game.image_url}
				alt='game picture'
				width='50'
				height={50}
			/>
			<div>{props.game.name}</div>
		</div>
	);
};

export default GameCard;
