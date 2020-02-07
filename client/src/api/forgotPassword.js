export default async function forgotPassword(email) {
  const url =
    process.env.REACT_APP_SERVER_BASE_URL + '/api/user/forgot-password';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
}
