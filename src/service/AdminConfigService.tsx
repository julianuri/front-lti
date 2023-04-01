async function getAdminConfig (userId: number) {
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/user-config?userId=' + userId);

	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}

	return await response.json();
}

async function updateAdminConfig (data: any): Promise<Response> {
	return await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/user-config?userId=' + data.userId, {
		method: 'POST',
		body: JSON.stringify({ ...data }),
		headers: { 'content-type': 'application/json' }
	});
}

export { getAdminConfig, updateAdminConfig };
