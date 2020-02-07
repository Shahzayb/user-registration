export default async function resetPassword(password, userId, query) {
  const url =
    process.env.REACT_APP_SERVER_BASE_URL +
    `/api/user/${userId}/reset-password${query}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password })
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
}
