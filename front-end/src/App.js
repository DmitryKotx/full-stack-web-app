import { useEffect } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import HomePage from './HomePage';
import { Route, Routes } from 'react-router-dom';
import { useLocalState } from './util/useLocalStorage';
import PrivateRout from './PrivateRoute';
import Login from './Login';

function App() {

  const [jwt, setJwt] = useLocalState("", "jwt");

  // useEffect(() => {
  //   if (!jwt) {
  //     const reqBody = {
  //       username : "aboba",
  //       password : "1234"
  //     }
  //     fetch("api/v1/auth/register", {
  //       headers: {
  //         'Access-Control-Allow-Origin': 'http://localhost:3000', // Указать ваш фронтенд
  //         'Content-Type': 'application/json',
  //       },
  //       method : "post",
  //       body : JSON.stringify(reqBody)
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       setJwt(data["token"]);
  //     })
  //   }
  // }, [])

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