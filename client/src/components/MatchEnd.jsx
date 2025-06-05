import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Hand } from './Cards';

function MatchEnd() {
  const location = useLocation();
  const navigate = useNavigate();
  const [matchInfo, setMatchInfo] = useState(null); 

  useEffect(() => {
    const { collected_situations, match_result } = location.state;
    setMatchInfo({
      collected_situations: collected_situations,
      match_result: match_result
    });
  }, []);

  const handleNewGame = () => {
    navigate('/match/new');
  }

  return (
    <Container className="text-center">
      <Alert variant={matchInfo.match_result.type}>{matchInfo.match_result.msg}</Alert>  
      <Hand situations={matchInfo.collected_situations} />
      <Button variant="success" size="lg" className="w-100 py-3 mb-3" onClick={handleNewGame}>
        Gioca una nuova partita
      </Button>
    </Container>
  )
}

export default MatchEnd;