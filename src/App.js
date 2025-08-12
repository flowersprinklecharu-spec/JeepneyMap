import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import AddEdit from './pages/AddEdit';
import View from './pages/View';
import About from './pages/About';
import Home from './pages/Home';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from './components/header';
import Scanner from './pages/Scanner';
function App() {
  return (
    <BrowserRouter>
      <div classname="App">
        <Header />
            <ToastContainer position="top-center" />
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route path="/add" element={<AddEdit/>}/>
          <Route path="/update/:id" element={<AddEdit/>}/>
          <Route path="/view/:id" element={<View/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/scan" element={<Scanner/>}/>
        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
