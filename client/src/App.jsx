import { useState } from 'react'
import './App.css'
import DefaultLayout from './components/DefaultLayout'

const fakeUser={
  user_id: 1,
  name: "Mario Rossi"
}

function App() {
  const [user, setUser] = useState('')
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  /*
  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo();
      // se l'utente non è loggato viene tornato 401
      // e quindi non si eseguono le due righe successive
      setLoggedIn(true);
      setUser(user);
    };
    checkAuth();
  }, []);
  

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    } catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
    setUser('');
    navigate("/");
  };
  */

  return (
    <Routes>
      <Route elemet={<DefaultLayout user={user} loggedIn = {loggedIn} handleLogout={handleLogout} message={message} setMessage={setMessage}/>}>
        <Route path='/' element={<HomeMenu/>}/>
        <Route path='/user/:userId/profile' element={<UserProfile user={user}/>}/>
        <Route path='/match/new' element={<MatchGuessWho user={user}/>}/>
        <Route path='/match/:matchId/play' element={user}/>
        <Route path='/match/:matchId/end'/>
        <Route path='*' element={<NotFound/>}/>
        <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin}/>}/>
      </Route>
    </Routes>    
  )
}

export default App
