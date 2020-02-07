export default async function getMyProfile(jwtToken) {
  const url = process.env.REACT_APP_SERVER_BASE_URL + '/api/user/me';
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`
    }
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error('HTTP-Error: ' + response.status);
  }
}
