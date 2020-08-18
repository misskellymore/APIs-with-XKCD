import React, { useState, useEffect } from 'react';
// axios is one of many libraries thatlets us make
// network requests to apis
// another option can be the fetch function that is built
// into the browser that we can use, however it's interface == yucky
// REST is a set of guidlines that dictates how we make requests,
// How we ask for data, and how we send data. Other systems are
// SOAP and graphQL
import axios from 'axios'
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comic, setComic] = useState(null);
  const fetchComic = (number) => {
    // setComic to null so we can get the Loading function
    // setComic(null)
    // we can change the above now w/setLoading
    setLoading(true);
    axios.get(`https://cors-anywhere.herokuapp.com/http://xkcd.com/${number}/info.0.json`)
    .then(res => setComic(res.data))
    .catch(err => {
      console.log(err);
      setError(err);
    })
    // after our then OR after our catchwe call 'finally' to wrap it up
    // this does the sam thing as our setLoading logic inside useEffect
    .finally(() => setLoading(false))
  }

  // created a new useEffect
  // notes below this function came first
  // fetchLatestComic is our call back function
  const fetchLatestComic = () => {
    setLoading(true);
    axios.get(`https://cors-anywhere.herokuapp.com/http://xkcd.com/info.0.json`)
    .then(res => {
      setComic(res.data)
      setLoading(false);
    })
    .catch(err => {
      console.log(err);
      setError(err)
      setLoading(false);
    });
  }
  // we don't want to make a network req on every render. That would be bad.
  // if done w/a public api. They will banned you for some period of
  // time, potentially permenitly, if you make too many req in too
  // short of a period of time.
  // So it is very important, everytime you make a network req
  // to put it inside a useEffect, or as a callback function. Never just
  // put it in your render function.
  // useEffect is used to run code SOMETIMES.
  // Also when in development, make sure to only have one tab opned
  // at a time. If you have multiple tabs open, all those tabs will submit
  // seperate requests. 
  // So we have a useEffect, and this useEffect will run when the 
  // application mounts the first time App() is renderd. 
  useEffect(() => {
    // and we are going to use it to make a req to the json api from https://xkcd.com/json.html
    // cors stands for cross origin resource sharing
    // what it means is that browser venders have decided that it is
    // in the best interest of the users of websites to only automatically
    // make requests to the sane domain. So if I'm on google.com
    // I can request all the google.com stuff that I want. If I'm on
    // BOA.com, I can request all of the BOA stuff that I want. What we don't want 
    // happening is going to banakofamerica.com and for this website
    // to make req to BOA, and show that stuff on their own website. That
    // would be bad. 
    // so what browsers do, is before they make a req to a different
    // domain, a differnt url, they send out a special check, and they
    // ask the server "Hey, what website are you expecting to see requests from"?
    // and the server will usually tell them, "my own website", or sometimes
    // they'll tell them "w/e, it doesn't matter. you're all good"
    // and the browser will respect w/e the server tells it, and will stop
    // the request from going through. And that is what's happening w/ https://xkcd.com/info.0.json
    // This api will not let us make requests from a different domain. But we are not stuck here. Bc
    // this isn't a real piece of security. So hwo do we get around this?
    // A lot of the times, what cors is there for is to prevent us from making
    // the wrong kinds of requests. A lot of the times, in order for us to interact w/an
    // api, we have to send along a key. Which is essentially a passcode identifying that it is
    // me who is using this api. And if we make this req in the browser
    // the user can open the network log and see that we're making
    // a req to https://xkcd.com/info.0.json and then my secrey key at the end. And that's bad
    // bc they can steal that. So those apis will prevent you from
    // making a req from a different domain, bc what they want you to do
    // is make a req to your own BE w/out the secret key. And the BE will take that
    // req, and then it will send that to the api, w/the secret key, successfully
    // hidden, and then it will come back to your BE and your BE will send the
    // response to the web browser. However, it is a hassel to set that up for every api
    // that we might come across, so in comes a package called "CORS Anywhere".
    // CORS Anywhere will let you spin up a server that will just automatically forward those reqs
    // from you. W/no piece of info identifying that they're coming from a different
    // domain. 
    // https://github.com/Rob--W/cors-anywhere
    // creaters invented live version for short projects => https://cors-anywhere.herokuapp.com/
    // so we put that in front of the actual api that we want to req
    // and it will handle resending that req and giving back the info that we want back
    // from it
    // setLoading(true);
    // axios.get(`https://cors-anywhere.herokuapp.com/http://xkcd.com/info.0.json`)
    // .then(res => {
    //   setComic(res.data)
    //   setLoading(false);
    // })
    // .catch(err => {
    //   console.log(err);
    //   setError(err)
    //   setLoading(false);
    // })
    fetchLatestComic();
  }, [])

  console.log(comic)

  // if we don't have a comic yet, then we're gonna return a div that says loading
  if(loading){
    return (
      <div>
        Loading...
      </div>
    )
  }

  // Hopefully a user will never see this. It is just a percaution
  if(!comic || error){
    return(
      <div>
        Error
      </div>
    )
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>React XKCD</h1>
        {comic.title}
          <button onClick={() => fetchComic(1)}>First Comic</button>
          <button   
          // instead of the if statement on onClick, we can set a disabled attribute
          disabled={comic.num <= 1}
          onClick={() => {
            if(comic.num > 1){
              fetchComic(comic.num - 1);
            }            
            }}>
          Previous Comic
          </button>
          <button onClick= {() => fetchComic(comic.num + 1)}>Next</button>
          <button onClick= {() => fetchLatestComic()}>Latest</button>
        <img src={comic.img} />
      </header>
    </div>
  );
}

export default App;
