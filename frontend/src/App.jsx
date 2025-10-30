import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Home from './pages/Home'
import Navbar from './components/layouts/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HistoryPage from './pages/History'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        {/* public routes */}
        <Route path='/login' element= {<LoginPage/>} />
        <Route path='/signup' element= {<SignupPage />} />
        {/* private routes */}
        <Route element = {<ProtectedRoute />}>
          <Route path='/' element= { <Home />} />
          <Route path='/history' element = { <HistoryPage />} />
          <Route path='/chat/:chatId' element = { <Home />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
