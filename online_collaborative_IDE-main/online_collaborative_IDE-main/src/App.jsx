import React from "react";
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Editorpage from './pages/Editorpage'
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <div>
        <Toaster
          position="top-right"
        >
        </Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
          <Route path='/editor/:roomId' element={<Editorpage></Editorpage>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
