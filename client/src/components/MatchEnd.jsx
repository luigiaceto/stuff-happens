import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Hand } from './Cards';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import API from '../API.mjs';
import SplitText from './reactbits_components/SplitText.jsx';

function MatchEnd({ loggedIn }) {
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
  // non è possibile passarla da MatchStart a MatchEnd poichè si trovano
  // in due route separate.
  const handleBegin = async () => {
    setLoading(true);
    const matchInfo = await API.startMatch();
    setLoading(false);
    if (matchInfo.error) {
      setMessage({msg: 'Ops, il server ha riscontrato un errore. Riprova', type: 'danger'});
      return;
    }
    const { match_id, starting_situations, table_situation } = matchInfo;
    const demo = loggedIn === true ? false : true;
    navigate(`/match/${match_id}/play`, {
      state: {
        matchId: match_id,
        startingSituations: starting_situations.sort((a, b) => a.misfortune_index - b.misfortune_index),
        tableSituation: table_situation,
        demo: demo
      }
    });
  }

  return (
    <Container fluid className="text-center">
      {/* all'inizio del rendering matchInfo è null quindi darebbe errore */}
      {matchInfo &&
      <>
        <SplitText
          text={`${matchInfo.match_result.msg}`}
          className="text-2xl font-semibold text-center fs-1"
          delay={80}
          duration={1}
          ease="power3.out"
          splitType="words"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          textAlign="center"
          color = {matchInfo.match_result.type === 'success' ? '#4bb52d' : '#ed4f2f'}
        />
        <h4 className='text-center mb-4 mt-3'>
          Carte raccolte durante la partita:
        </h4>
        <Hand situations={matchInfo.collected_situations} />
        {!loading && 
          <Button variant="success" size="lg" className="py-3 mb-3 mt-5" style={{ width: "300px" }} onClick={handleBegin}>
            Inizia una nuova partita
          </Button>}
        {loading && 
          <Spinner animation="border" variant="success"/>}
      </>}
    </Container>
  )
}

export default MatchEnd;