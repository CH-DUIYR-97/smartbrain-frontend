import React, { useState } from 'react';
import Navigation from './components/navigation/Navigation';
import Logo from './components/Logo';
import ImageLinkForm from './components/ImageLinkForm'; 
import Rank from './components/Rank';
import FaceRecognition from './components/FaceRecognition';
import SignIn from './components/SignIn';
import Register from './components/Register';

function App() {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    });
  };

  const onInputChange = (event) => {
    console.log(event.target.value);
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
  setImageUrl(input);
  fetch('http://localhost:3001/imageurl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: input
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3001/image', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.id
          })
        })
          .then(res => res.json())
          .then(count => {
            setUser(Object.assign(user, { entries: count }));
          })
          .catch(console.log);
      }
      displayFaceBox(calculateFaceLocation(response));
    })
    .catch(err => console.log(err));
};

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onRouteChange = (route) => {
    setRoute(route);
  };

  return (
    <div className="App">
      <header className="app-header">
        <Logo />
        <Navigation onRouteChange={onRouteChange} isSignedIn={route === 'home'} />
      </header>
      <main className="app-main">
        {route === 'home' ? (
          <>
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </>
        ) : route === 'signin' ? (
          <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />
        ) : (
          <Register loadUser={loadUser} onRouteChange={onRouteChange} />
        )}
      </main>
    </div>
  );
}

export default App;