import { useEffect } from 'react';
import './App.css';
import { useLocalState } from './util/useLocalStorage';

function App() {

  const [jwt, setJwt] = useLocalState("", "jwt");

  useEffect(() => {
    if (!jwt) {
      const reqBody = {
        username : "aboba",
        password : "1234"
      }
      fetch("api/v1/auth/register", {
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000', // Указать ваш фронтенд
          'Content-Type': 'application/json',
        },
        method : "post",
        body : JSON.stringify(reqBody)
      })
      .then(response => response.json())
      .then(data => {
        setJwt(data["token"]);
      })
    }
  }, [])

  return (
    <div className="App">
      <h1>Hello world</h1>
      <div>JWT Value is {jwt}</div>
    </div>
  );
}

export default App;
