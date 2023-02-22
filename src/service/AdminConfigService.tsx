import UserForm from '../types/UserForm';
import AdminConfig from '../types/AdminConfig';

async function getAdminConfig(userId: number) {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/user-config?userId=' + userId);

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return await response.json();
}

async function updateAdminConfig(data: any): Promise<Response> {
  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/user-config?userId=' + data.userId, {
    method: 'POST',
    body: JSON.stringify({ ...data }),
    headers: { 'content-type': 'application/json' }
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  //let response2 = await response.json();
  //return response2;
  //console.log(response);
}

function lolo() {
  const lolo = updateAdminConfig({email: 'ksks', password: 'sjsj'});



}

export { getAdminConfig, updateAdminConfig };
