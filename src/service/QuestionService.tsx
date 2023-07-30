async function getRandomQuestion(data: object) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/question',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data }),
    },
  );

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}

export { getRandomQuestion };
