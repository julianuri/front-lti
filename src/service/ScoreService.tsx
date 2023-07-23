async function setLTIScore(assignmentId: number, userId: string, gameId: number, sessionId: string, launchId: string) {
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/score', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ assignmentId, userId, gameId, sessionId, launchId })
	});

	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}

	return await response.json();
}

export { setLTIScore };
