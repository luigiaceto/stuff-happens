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
    credentials: 'include'
  });
  if (response.ok) {
    const matchInfoJson = await response.json();
    return matchInfoJson;
  } else if (response.status === 503) {
    return {error: 'Service Unavailable'};
  } else if (response.status === 422) {
    return {error: 'Unprocessable Entity'};
  } else {
    throw new Error('Unknown Error');
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
    return {error: 'Match Not Found'};
  } else if (response.status === 422) {
    return (result);
  } else if (response.status === 503) {
    return {error: 'Service Unavailable'};
  } else {
    throw new Error('Unknown Error');
  }
}

const getNextSituation = async (match_id) => {
  const response = await fetch(`${SERVER_URL}/api/matches/${match_id}/situation`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  if (response.ok) {
    const situation = await response.json();
    return situation;
  } else if (response.status === 404) {
    return {error: 'Match Not Found'};
  } else if (response.status === 500) {
    return {error: 'Internal Server Error'};
  } else {
    throw new Error('Unknown Error');
  }
}

const getMatchHistory = async (user_id) => {
  const response = await fetch(`${SERVER_URL}/api/users/${user_id}/matches`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  });
  if (response.ok) {
    const matches = await response.json();
    return matches;
  } else if (response.status === 500) {
    throw new Error('Internal Server Error');
  }
}

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const API = {
  startMatch,
  guessPosition,
  getNextSituation,
  getMatchHistory,
  logIn,
  getUserInfo,
  logOut
};
export default API;