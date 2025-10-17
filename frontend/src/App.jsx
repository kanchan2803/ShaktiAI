import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Home from './pages/Home'
import Navbar from './components/layouts/Navbar'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element= { <Home />} />
        <Route path='/login' element= {<LoginPage/>} />
        <Route path='/signup' element= {<SignupPage />} />
      </Routes>
    </>
  )
}

export default App
