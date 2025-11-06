
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import BookingPage from './pages/BookingPage'
import SignUpPage from './pages/SignUpPage'
import SignInPage from './pages/SignInPage'



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/booking' element={<BookingPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/sign-in' element={<SignInPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
