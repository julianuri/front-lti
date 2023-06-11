async function getAvatarConfig(userId: string) {
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'canvas/avatar?userId=' + userId);

	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}

	return await response.json();
}

async function saveAvatarConfig(data: any, userId: string) {
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'canvas/avatar', {
		method: 'POST',
		body: JSON.stringify({ 'config': data, userId }),
		headers: { 'content-type': 'application/json' }
	});

	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}A;

	return await response.json();
}

export { getAvatarConfig, saveAvatarConfig };
