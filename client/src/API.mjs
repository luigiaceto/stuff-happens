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
    const matchInfoJson = await response.json();
    return matchInfoJson;
  } else if (response.status === 503) {
    throw new Error('Service Unavailable');
  } else if (response.status === 422) {
    throw new Error('Unprocessable Entity');
  }
}

const guessPosition = async (match_id, guessed_situation_id, guessed_position, match_situations) => {
  const response = await fetch(`${SERVER_URL}/api/matches/${match_id}/guess`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      match_id: match_id,
      guessed_situation_id: guessed_situation_id,
      guessed_position: parseInt(guessed_position),
      match_situations: match_situations
    }),
  });
  if (response.ok) {
    const result = await response.json();
    return result;
  } else if (response.status === 404) {
    throw new Error('Match Not Found');
  } else if (response.status === 422) {
    throw new Error('Unprocessable Entity');
  } else if (response.status === 503) {
    throw new Error('Service Unavailable');
  }
}

const getNextSituation = async (match_id) => {
  const response = await fetch(`${SERVER_URL}/api/matches/${match_id}/situation`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.ok) {
    const situation = await response.json();
    return situation;
  } else if (response.status === 404) {
    throw new Error('Match Not Found');
  } else if (response.status === 500) {
    throw new Error('Internal Server Error');
  }
}

const getMatchHistory = async (user_id) => {
  const response = await fetch(`${SERVER_URL}/api/users/${user_id}/matches`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (response.ok) {
    const matches = await response.json();
    return matches;
  } else if (response.status === 500) {
    throw new Error('Internal Server Error');
  }
}

const API = {
  startMatch,
  guessPosition,
  getNextSituation,
  getMatchHistory
};
export default API;