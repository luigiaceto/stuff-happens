import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Hand } from './Cards';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import API from '../API.mjs';

function MatchEnd({loggedIn}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [matchInfo, setMatchInfo] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { collected_situations, end_message } = location.state;
    setMatchInfo({
      collected_situations: collected_situations,
      match_result: end_message
    });
  }, []);

  // la callback è praticamente identica a quella di MatchStart, purtroppo
  // non è possibile passarla da matchStart a matchEnd poichè si trovano
  // in due route separate.
  const handleBegin = async () => {
    setLoading(true);
    const matchInfo = await API.startMatch(loggedIn ? 'No' : 'Yes');
    setLoading(false);
    if (matchInfo.error) {
      setMessage({msg: 'Ops, il server ha riscontrato un errore. Riprova', type: 'danger'});
      return;
    }
    const { match_id, starting_situations, table_situation } = matchInfo;
    navigate(`/match/${match_id}/play`, {
      state: {
        matchId: match_id,
        startingSituations: starting_situations.sort((a, b) => a.misfortune_index - b.misfortune_index),
        tableSituation: table_situation
      }
    });
  }

  return (
    <Container fluid className="text-center">
      {/*nel rendering iniziale matchInfo è null*/}
      {matchInfo &&
      <>
      <Alert className="w-50 text-center mx-auto" variant={matchInfo.match_result.type}>{matchInfo.match_result.msg}</Alert>  
      <h3 className='text-center mb-4'>
        Carte raccolte durante la partita:
      </h3>
      <Hand situations={matchInfo.collected_situations} />
      {!loading && 
        <Button variant="success" size="lg" className="w-25 py-3 mb-3 mt-5" onClick={handleBegin}>
          Gioca una nuova partita
        </Button>}
      {loading && 
        <Spinner animation="border" variant="success"/>}
      </>}
    </Container>
  )
}

export default MatchEnd;