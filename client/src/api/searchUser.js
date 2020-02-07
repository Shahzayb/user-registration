export default async function searchUser(q, page, size) {
  const url =
    process.env.REACT_APP_SERVER_BASE_URL +
    `/api/user?page=${page}&size=${size}&q=${q}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
}
