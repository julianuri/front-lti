interface IGameCard {
  id: number,
  name: string,
  setGame: (game: {id: number, name: string}) => void
}

export default IGameCard;
