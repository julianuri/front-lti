async function getAssignments (userId: string, courseId: string) {
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/assignments?userId=' + userId + '&assignmentId=' + courseId);

	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}

	return await response.json();
}

async function saveAssignment (data: any) {
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/assignments', {
		method: 'POST',
		body: JSON.stringify({ ...data }),
		headers: { 'content-type': 'application/json' }
	});

	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}

	return await response.json();
}

async function dropAssignment (id: any) {
	const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/assignments', {
		method: 'DELETE',
		body: JSON.stringify({ id }),
		headers: { 'content-type': 'application/json' }
	});

	if (!response.ok) {
		const message = `An error has occurred: ${response.status}`;
		throw new Error(message);
	}

	return await response.json();
}

export { getAssignments, saveAssignment, dropAssignment };
