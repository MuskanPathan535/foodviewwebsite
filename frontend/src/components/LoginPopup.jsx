import { Link } from 'react-router-dom'
import '../styles/modal.css'

const LoginPopup = ({ open, mode = 'login', onClose }) => {
  if (!open) return null

  const title = mode === 'login' ? 'Please Login or Register first' : 'Create an account to continue'
  const description = mode === 'login'
    ? 'You need to sign in before interacting with this post.'
    : 'Choose how you want to register before continuing.'

  const actions = mode === 'login'
    ? [
        { label: 'User Login', to: '/user/login' },
        { label: 'Food Partner Login', to: '/food-partner/login' },
      ]
    : [
        { label: 'User Register', to: '/user/register' },
        { label: 'Food Partner Register', to: '/food-partner/register' },
      ]

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-popup-title">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">Authentication required</p>
            <h2 id="auth-popup-title">{title}</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close auth menu">
            ✕
          </button>
        </div>
        <p className="modal-copy">{description}</p>
        <div className="modal-actions">
          {actions.map((action) => (
            <Link key={action.label} to={action.to} className="modal-action-button" onClick={onClose}>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LoginPopup
