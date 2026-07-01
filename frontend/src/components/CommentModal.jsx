import { useEffect, useMemo, useState } from 'react'
import '../styles/modal.css'

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return date.toLocaleDateString()
}

const CommentModal = ({ open, item, comments = [], currentUser, onClose, onSubmit }) => {
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!open) setDraft('')
  }, [open])

  const totalComments = comments.length
  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=60'

  if (!open) return null

  const handleSend = (event) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setDraft('')
  }

  const formatCommentTime = (comment) => formatTime(comment.time ?? comment.createdAt)

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="comment-modal-title">
      <div className="modal-card modal-card--wide">
        <div className="modal-header">
          <div>
            <p className="modal-eyebrow">Comments</p>
            <h2 id="comment-modal-title">{item?.description || 'Video comments'}</h2>
            <p className="modal-copy">{totalComments} comment{totalComments === 1 ? '' : 's'}</p>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close comments">
            ✕
          </button>
        </div>

        <div className="comment-list">
          {comments.length === 0 ? (
            <div className="comment-empty">No comments yet. Be the first to share your thoughts.</div>
          ) : (
            comments.map((comment) => (
              <div key={comment._id ?? comment.id} className="comment-item">
                <img className="comment-avatar" src={comment.avatar || defaultAvatar} alt="User avatar" />
                <div className="comment-body">
                  <div className="comment-meta">
                    <span className="comment-author">{comment.userName || 'Guest'}</span>
                    <span className="comment-time">{formatCommentTime(comment)}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form className="comment-form" onSubmit={handleSend}>
          <input
            className="comment-input"
            type="text"
            placeholder={`Comment as ${currentUser || 'you'}...`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Write a comment"
          />
          <button className="comment-submit" type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default CommentModal
