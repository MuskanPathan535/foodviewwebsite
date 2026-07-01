import { Link } from 'react-router-dom'
import '../styles/navbar.css'

const DropdownMenu = ({ items = [], onClose }) => {
  if (items.length === 0) return null

  return (
    <div className="dropdown-menu" role="menu" aria-label="Menu options">
      {items.map((item) => (
        item.to ? (
          <Link
            key={item.label}
            to={item.to}
            className="dropdown-item"
            onClick={onClose}
          >
            <span>{item.label}</span>
          </Link>
        ) : (
          <button
            key={item.label}
            className="dropdown-item"
            type="button"
            onClick={() => {
              item.onClick?.()
              onClose?.()
            }}
          >
            <span>{item.label}</span>
          </button>
        )
      ))}
    </div>
  )
}

export default DropdownMenu
