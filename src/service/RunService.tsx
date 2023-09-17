async function getRun(data: object) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/run',
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
    const message = `Un error con estado: ${response.status} ha ocurrido`;
    throw new Error(message);
  }

  return await response.json();
}

export { getRun };
