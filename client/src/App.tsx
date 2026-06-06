import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import {RoomPage} from "./pages/RoomPage"
import {LoginPage} from "./pages/LoginPage"
import {RegisterPage} from "./pages/RegisterPage"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "./state/store"
import { useGetCurrentUserQuery } from "./state/api"
import { useEffect, useState } from "react"
import { setCredentials } from "./state/authSlice"
import { MyBookingsPage } from "./pages/MyBookingsPage"
import { AdminBookingsPage } from "./pages/AdminBookingsPage"

function App(){
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token)
  const user = useSelector((state: RootState) => state.auth.user)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);  

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const {data: userData} = useGetCurrentUserQuery(undefined, {
    skip: !token || user !== null,
  })
  useEffect(() => {
    if(userData && token && !user) {
      dispatch(setCredentials({user: userData, token}))
    }
  }, [userData, token, user, dispatch])

  return(
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',        
        transition: 'all 0.3s ease'  
      }}>
        <Navbar theme={theme} toggleTheme={toggleTheme}/>

        <Routes>
          <Route path="/" element={<RoomPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App;