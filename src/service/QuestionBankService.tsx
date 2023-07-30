async function getAllQuestionBanks(userId: string) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/question-bank?userId=' + userId,
  );

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}

async function getBankQuestions(bankId: number) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/question?bankId=' + bankId,
  );

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}

async function saveQuestionBank(data: any) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/question-bank',
    {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'content-type': 'application/json' },
    },
  );

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return response;
}

async function dropBank(id: any) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/question-bank',
    {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'content-type': 'application/json' },
    },
  );

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}

export { getAllQuestionBanks, getBankQuestions, saveQuestionBank, dropBank };
