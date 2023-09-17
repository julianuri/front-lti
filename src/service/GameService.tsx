async function getGames() {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/games',
  );

  if (!response.ok) {
    const message = `Un error con estado: ${response.status} ha ocurrido`;
    throw new Error(message);
  }

  return await response.json();
}

async function getGame(id: number) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/game?gameId=' + id,
  );

  if (!response.ok) {
    const message = `Un error con estado: ${response.status} ha ocurrido`;
    throw new Error(message);
  }

  return await response.json();
}

export { getGames, getGame };
