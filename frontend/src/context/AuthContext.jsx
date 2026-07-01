import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const defaultAuth = {
  status: 'pending',
  type: 'guest',
  user: null,
  partner: null,
}

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(defaultAuth)

  useEffect(() => {
    axios.defaults.withCredentials = true

    const loadSession = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/me')
        const data = response.data ?? {}

        if (data.user) {
          setAuth({ status: 'ready', type: 'user', user: data.user, partner: null })
        } else if (data.foodPartner) {
          setAuth({ status: 'ready', type: 'partner', user: null, partner: data.foodPartner })
        } else {
          setAuth({ status: 'ready', type: 'guest', user: null, partner: null })
        }
      } catch (error) {
        setAuth({ status: 'ready', type: 'guest', user: null, partner: null })
      }
    }

    loadSession()
  }, [])

  const updateAuth = (data) => {
    if (data.user) {
      setAuth({ status: 'ready', type: 'user', user: data.user, partner: null })
    } else if (data.foodPartner) {
      setAuth({ status: 'ready', type: 'partner', user: null, partner: data.foodPartner })
    } else {
      setAuth({ status: 'ready', type: 'guest', user: null, partner: null })
    }
  }

  const logout = async () => {
    try {
      if (auth.type === 'partner') {
        await axios.get('http://localhost:3000/api/auth/food-partner/logout')
      } else {
        await axios.get('http://localhost:3000/api/auth/user/logout')
      }
    } catch (error) {
      // ignore
    }
    setAuth({ status: 'ready', type: 'guest', user: null, partner: null })
  }

  const isAuthenticated = auth.type === 'user' || auth.type === 'partner'

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, updateAuth, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
