import { useNavigate } from 'react-router';
import { Container, Button } from 'react-bootstrap';

function MatchStart({user}) {
  const navigate = useNavigate();

  const handleBegin = () => {

    const startingSituations = [
      { id: 1, name: 'Situation 2', misfortune_index: 22.1, img_path: 'a' },
      { id: 2, name: 'Situation 1', misfortune_index: 10, img_path: 'a' },
      { id: 3, name: 'Situation 3', misfortune_index: 30, img_path: 'a' }
    ]
    const tableSituation = { id: 4, name: 'Situation 4', img_path: 'a' };
    const matchId = 1; 

    navigate(`/match/${matchId}/play`, {
      state: {
        matchId: matchId,
        startingSituations: startingSituations.sort((a, b) => a.misfortune_index - b.misfortune_index),
        tableSituation: tableSituation
      }
    });
  }

  return (
    <Container>
      <h1 className='mt-3 text-center'>Regolamento</h1>  
      <ul>
        <li>Inizierai con 3 carte in mano ed una sul campo</li>
        <li>Lo scopo del gioco è di arrivare a 6 carte in mano, inserendone una alla volta dal tavolo seguendo l'ordine 
            crescente dell'indice di sfortuna (che dovrai immaginare per le carte del tavolo)</li> 
        <li>Ogni round avrai 30 secondi per 
            indovinare la posizione, tra le carte della tua mano.</li>
        <li>Per eseguire la scelta avrai a disposizione un selettore. potrai selezionare una posizione da 1 ad n+1, dove n sono le carte
            che avrai in mano ad ogni round</li>
        <li>Se non selezioni nulla
            perdi il round automaticamente, altrimenti se indovini guadagni la carta</li>
        <li>Se perdi 3 carte in totale la partita è persa complessivamente</li>
      </ul>
      <p className='mt-5'> Esempio: se vuoi mettere la carta in mano come 1a da sinistra
        seleziona 1, se vuoi metterla come 2a seleziona 2 e così via...</p>
      <h3 className='text-center'>Buon divertimento e buona (s)fortuna !</h3>
      <Container className="text-center">
        <Button variant="success" size="lg" className="w-25 py-3 mb-3 mt-5 mx-auto" onClick={handleBegin}>
          Inizia
        </Button>
      </Container>
    </Container>
  )
}

export default MatchStart;