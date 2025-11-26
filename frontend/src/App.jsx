import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Bot from './pages/Bot'
import Navbar from './components/layouts/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import HistoryPage from './pages/History'
import HelplineNumbers from './pages/HelplineNumbers'
import LegalUpdatesPage from './pages/LegalUpdatesPage'
import AddUpdatePage from './pages/AddUpdatePage'
import HomePage from './pages/HomePage'
import DraftsDocs from './pages/DraftsDocs'
import SafeSpaceLocator from './pages/SafeSpaceLocator'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        {/* public routes */}
        <Route path='/login' element= {<LoginPage/>} />
        <Route path='/signup' element= {<SignupPage />} />
        <Route path="/helplines" element={<HelplineNumbers />} />
        <Route path="/legal-updates" element={<LegalUpdatesPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        {/* private routes */}
        <Route element = {<ProtectedRoute />}>
          <Route path='/' element= { <Bot />} />
          <Route path='/history' element = { <HistoryPage />} />
          <Route path='/chat/:chatId' element = { <Bot />} />
          <Route path="/add-update" element={<AddUpdatePage />} />
          <Route path="/safe-space-locator" element={<SafeSpaceLocator />} />
          <Route path="/drafts" element={<DraftsDocs />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
