import toast from 'react-hot-toast';
import classes from './GameSelector.module.scss';
import { useEffect, useState } from 'react';
import { getGames } from '../../../service/GameService';
import GameCard from './GameCard/GameCard';
import Link from 'next/link';
import QuizCreator from '../Creator/Quiz/QuizCreator';
import styles from '../Creator/Quiz/QuizCreator.module.scss';

const GameSelector = () => {
	const [games, setGames] = useState([]);
	const [selectedGame, setSelectedGame] = useState({ name: '', id: 0 });

	useEffect(() => {
		getGames().then(async (response) => {
			setGames(response.data);
		}).catch((error) =>
			toast.error(error.message)
		);
	}, []);

	const gameSelector = (
		<>
			<div>Choose game:</div>
			<br />
			<div className={classes.cardsContainer}>
				{games.map(x => {
					return (
						<GameCard
							key={x.id} game={x} image={x.image_url} game_link={x.game_page}
							setGame={setSelectedGame}
						/>
					);
				})}
			</div>
			<Link href='/instructor'>Back</Link>
		</>
	);

	return (
		<>
			{(selectedGame.name == 'quiz') ? <QuizCreator gameId={selectedGame.id} /> : null}
			{(selectedGame.name == '')
				? gameSelector
				: <button className={styles.button} onClick={() => setSelectedGame({ name: '', id: 0 })}>Back</button>}
		</>
	);
};

export default GameSelector;
