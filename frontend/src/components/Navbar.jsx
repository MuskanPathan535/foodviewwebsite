import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DropdownMenu from './DropdownMenu'
import '../styles/navbar.css'

const Navbar = () => {
  const { auth, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const closeMenus = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setLoginOpen(false)
        setRegisterOpen(false)
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', closeMenus)
    return () => document.removeEventListener('mousedown', closeMenus)
  }, [])

  const handleLogout = async () => {
    await logout()
    setProfileOpen(false)
    navigate('/')
  }

  const userMenu = [
    { label: 'My Profile', to: '/' },
    { label: 'Saved', to: '/saved' },
    { label: 'Logout', onClick: handleLogout },
  ]

  const partnerMenu = [
    { label: 'My Profile', to: auth.partner ? `/food-partner/${auth.partner._id}` : '/create-food' },
    { label: 'Create Food', to: '/create-food' },
    { label: 'Logout', onClick: handleLogout },
  ]

  return (
    <header className="navbar" ref={rootRef}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="FoodView home">
          FoodView
        </Link>

        <div className="navbar__actions">
          {!isAuthenticated ? (
            <>
              <div className="navbar__group">
                <button
                  type="button"
                  className="navbar__button navbar__button--ghost"
                  onClick={() => {
                    setLoginOpen((value) => !value)
                    setRegisterOpen(false)
                    setProfileOpen(false)
                  }}
                >
                  Login
                </button>
                {loginOpen && (
                  <DropdownMenu
                    items={[
                      { label: 'Login as User', to: '/user/login' },
                      { label: 'Login as Food Partner', to: '/food-partner/login' },
                    ]}
                    onClose={() => setLoginOpen(false)}
                  />
                )}
              </div>

              <div className="navbar__group">
                <button
                  type="button"
                  className="navbar__button navbar__button--primary"
                  onClick={() => {
                    setRegisterOpen((value) => !value)
                    setLoginOpen(false)
                    setProfileOpen(false)
                  }}
                >
                  Sign Up
                </button>
                {registerOpen && (
                  <DropdownMenu
                    items={[
                      { label: 'Register as User', to: '/user/register' },
                      { label: 'Register as Food Partner', to: '/food-partner/register' },
                    ]}
                    onClose={() => setRegisterOpen(false)}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="navbar__group">
              <button
                type="button"
                className="navbar__profile-button"
                aria-label="User profile menu"
                onClick={() => {
                  setProfileOpen((value) => !value)
                  setLoginOpen(false)
                  setRegisterOpen(false)
                }}
              >
                <span>{auth.type === 'user' ? auth.user?.fullName?.charAt(0).toUpperCase() : auth.partner?.name?.charAt(0).toUpperCase()}</span>
              </button>
              {profileOpen && (
                <DropdownMenu
                  items={auth.type === 'partner' ? partnerMenu : userMenu}
                  onClose={() => setProfileOpen(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
