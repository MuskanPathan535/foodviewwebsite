const ProtectedAction = ({ isAllowed, onAction, onAuthRequired, children, ...props }) => {
  const handleClick = () => {
    if (isAllowed) {
      onAction?.()
    } else {
      onAuthRequired?.()
    }
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

export default ProtectedAction
