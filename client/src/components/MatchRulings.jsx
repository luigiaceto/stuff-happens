import { useNavigate, Navigate } from 'react-router';

function MatchStart({user}) {
  const navigate = useNavigate();

  const handleBegin = () => {
    // fetch dati
    const startingSituations = [
      { id: 1, name: 'Situation 1', description: 'desc1', img_path: 'path1.jpg' },
      { id: 2, name: 'Situation 2', description: 'desc2', img_path: 'path2.jpg' },
      { id: 3, name: 'Situation 3', description: 'desc3', img_path: 'path3.jpg' }
    ]
    const tableSituation = { id: 4, name: 'Table Situation', description: 'descTable', img_path: 'pathTable.jpg' };
    const matchId = 1; 

    navigate(`/match/${matchId}/play`, {
      state: {
        matchId: matchId,
        startingSituations: startingSituations,
        tableSituation: tableSituation
      }
    });
  }

  return (
    <Container className="text-center">
      <h1>Regolamento</h1>
      <p>Inizierai con 3 carte in mano ed una sul campo. Ogni round avrai 30 secondi per 
        indovinare in che posizione, tra le carte della mano, dovrà essere inserita la carta.
        Per selezionare la posizione avrai a disposizione un selettore. Se non selezioni nulla
        perdi il round, altrimenti potrai selezionare una posizione da 1 ad n+1, dove n sono le carte
        che avrai in mano ad ogni turno. Ad esempio, se vuoi mettere la carta come prima da sinistra
        seleziona 1, se vuoi metterla come seconda seleziona 3 e così via...
        Buon divertimento e buona (s)fortuna !</p>  

      <Button variant="success" size="lg" className="w-100 py-3 mb-3" onClick={handleBegin}>
        Inizia
      </Button>
    </Container>
  )
}