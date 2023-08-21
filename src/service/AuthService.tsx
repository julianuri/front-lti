import UserForm from '../types/UserForm';

async function registerUser(data: UserForm) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/register',
    {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'content-type': 'application/json' },
    },
  );

  if (!response.ok) {
    const message = `Un error ha ocurrido: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}

async function verifyUserCredentials(data: UserForm): Promise<Response> {
  return await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/login', {
    method: 'POST',
    body: JSON.stringify({ ...data }),
    headers: { 'content-type': 'application/json' },
  });
}

export { registerUser, verifyUserCredentials };
