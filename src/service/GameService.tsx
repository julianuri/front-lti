async function getGames () {
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/games');

	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}

	return await response.json();
}

export { getGames };
