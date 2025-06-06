const SERVER_URL = 'http://localhost:3001';

const startMatch = async (demo) => {
  const response = await fetch(`${SERVER_URL}/api/matches/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      demo: demo
    }),
  });
  if (response.ok) {
    
  } else if (response.status === 503) {
    throw new Error('Service Unavailable');
  } else if (response.status === 422) {
    throw new Error('Unprocessable Entity');
  }
}

const API = {
  startMatch
};
export default API;