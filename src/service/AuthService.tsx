import UserForm from '../types/UserForm';

async function registerUser (data: UserForm) {
	return await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/register', {
		method: 'POST',
		body: JSON.stringify({ ...data }),
		headers: { 'content-type': 'application/json' }
	});
}

async function verifyUserCredentials (data: UserForm): Promise<Response> {
	return await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/login', {
		method: 'POST',
		body: JSON.stringify({ ...data }),
		headers: { 'content-type': 'application/json' }
	});
}

export { registerUser, verifyUserCredentials };
