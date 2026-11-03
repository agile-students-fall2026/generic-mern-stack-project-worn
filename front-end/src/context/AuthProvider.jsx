import { useState } from 'react'
import { AuthContext } from './authContext'

const SESSION_KEY = 'worn-demo-session'

function readSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  } catch {
    return false
  }
}

export default function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(readSession)

  function updateSession(loggedIn) {
    setIsLoggedIn(loggedIn)
    try {
      if (loggedIn) sessionStorage.setItem(SESSION_KEY, 'true')
      else sessionStorage.removeItem(SESSION_KEY)
    } catch {
      return
    }
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      logIn: () => updateSession(true),
      logOut: () => updateSession(false),
    }}>
      {children}
    </AuthContext.Provider>
  )
}
