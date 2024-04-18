import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RouterPage from './components/RouterPage'; // Assuming RouterPage.js is in the same directory
import Registration from './components/Registration';
import Login from './components/Login';


function App() {
  return (
    <div className="App">
      <Registration />
    </div>
  );
}

export default App;
