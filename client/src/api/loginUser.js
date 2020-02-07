export default async function postUser(user) {
  const url = process.env.REACT_APP_SERVER_BASE_URL + '/api/user/login';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
}
