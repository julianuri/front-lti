async function getAssignments(
  userId: string,
  courseId: string,
  isStudent: boolean,
) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL +
      'api/assignments?userId=' +
      userId +
      '&courseId=' +
      courseId +
      '&isStudent=' +
      isStudent,
  );

  if (!response.ok) {
    const message = `Un error con estado: ${response.status} ha ocurrido`;
    throw new Error(message);
  }

  return await response.json();
}

async function saveAssignment(data: any) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/assignments',
    {
      method: 'POST',
      body: JSON.stringify({ ...data }),
      headers: { 'content-type': 'application/json' },
    },
  );

  if (!response.ok) {
    const message = `Un error con estado: ${response.status} ha ocurrido`;
    throw new Error(message);
  }

  return await response.json();
}

async function saveMemoryAssignment(data: any) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/assignments',
    {
      method: 'POST',
      body: data,
    },
  );

  if (!response.ok) {
    const message = `Un error con estado: ${response.status} ha ocurrido`;
    throw new Error(message);
  }

  return await response.json();
}

async function dropAssignment(id: any) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + 'api/assignments',
    {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'content-type': 'application/json' },
    },
  );

  if (!response.ok) {
    const message = `Un error con estado: ${response.status} ha ocurrido`;
    throw new Error(message);
  }

  return await response.json();
}

export { getAssignments, saveAssignment, dropAssignment, saveMemoryAssignment };
