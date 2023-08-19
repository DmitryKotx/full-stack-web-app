import './App.css';
import Dashboard from './Dashboard';
import HomePage from './HomePage';
import { Route, Routes } from 'react-router-dom';
import { useLocalState } from './util/useLocalStorage';
import PrivateRout from './PrivateRoute';
import Login from './Login';

function App() {

  const [jwt, setJwt] = useLocalState("", "jwt");

  return (
    <Routes>
      <Route path='/dashboard' element={
        <PrivateRout>
          <Dashboard />
        </PrivateRout>
      }/>
      <Route path='/login' element={<Login />}/>
      <Route path='/' element={<HomePage />}/>
    </Routes>
  );
}

export default App;