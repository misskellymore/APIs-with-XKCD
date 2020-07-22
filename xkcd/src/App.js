import React, { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';

function App() {

  useEffect(() => {
    axios.get('https://cors-anywhere.herokuapp.com/http://xkcd.com/info.0.json')
    .then(res => console.log(res))
    .catch(err => console.log(err))
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <h1>React XKCD</h1>

      </header>
    </div>
  );
}

export default App;
