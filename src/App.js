import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import RouterPage from './components/RouterPage'; // Assuming RouterPage.js is in the same directory
import Registration from './components/Registration';
import Login from './components/Login';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Registration />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
