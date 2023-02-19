import UserForm from '../types/UserForm';

async function registerUser(data: UserForm) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/register', {
    method: 'POST',
    body: JSON.stringify({ ...data }),
    headers: { 'content-type': 'application/json' }
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  console.log(response);
}

async function loginUser(data: UserForm) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/login', {
    method: 'POST',
    body: JSON.stringify({ ...data }),
    headers: { 'content-type': 'application/json' }
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  console.log(response);
}

export { registerUser, loginUser };
