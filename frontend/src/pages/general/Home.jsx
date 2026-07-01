

// import '../../styles/reels.css'

// const Home = () => {
    
//   return (
//     <div>home</div>
//   )
// }

// export default Home

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../styles/reels.css'
import '../../styles/modal.css'
import ReelFeed from '../../components/ReelFeed'
import LoginPopup from '../../components/LoginPopup'
import CommentModal from '../../components/CommentModal'
import { useAuth } from '../../context/AuthContext'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [commentOpen, setCommentOpen] = useState(false)
  const [authPromptOpen, setAuthPromptOpen] = useState(false)
  const [authPromptMode, setAuthPromptMode] = useState('login')
  const [commentsByItem, setCommentsByItem] = useState({})
  const { auth, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('http://localhost:3000/api/food', { withCredentials: true })
      .then((response) => {
        const fetched = (response.data.foodItems || []).map((food) => ({
          ...food,
          likeCount: food.likeCount ?? 0,
          savesCount: food.savesCount ?? 0,
          comments: food.comments ?? [],
        }))
        setVideos(fetched)
      })
      .catch(() => {
        // ignore fetch failure
      })
  }, [])

  const currentUserName = useMemo(() => {
    if (auth.type === 'user') return auth.user?.fullName || 'You'
    if (auth.type === 'partner') return auth.partner?.name || 'Partner'
    return 'You'
  }, [auth])

  const openAuthPrompt = (mode = 'login') => {
    setAuthPromptMode(mode)
    setAuthPromptOpen(true)
  }

  const handleLike = async (item) => {
    if (!isAuthenticated) {
      openAuthPrompt('login')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/food/like',
        { foodId: item._id },
        { withCredentials: true }
      )
      const delta = response.data.like ? 1 : -1
      setVideos((prev) => prev.map((video) => (
        video._id === item._id ? { ...video, likeCount: Math.max(0, (video.likeCount ?? 0) + delta) } : video
      )))
    } catch {
      openAuthPrompt('login')
    }
  }

  const handleSave = async (item) => {
    if (!isAuthenticated) {
      openAuthPrompt('login')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/food/save',
        { foodId: item._id },
        { withCredentials: true }
      )
      const delta = response.data.save ? 1 : -1
      setVideos((prev) => prev.map((video) => (
        video._id === item._id ? { ...video, savesCount: Math.max(0, (video.savesCount ?? 0) + delta) } : video
      )))
    } catch {
      openAuthPrompt('login')
    }
  }

  const handleCommentClick = (item) => {
    if (!isAuthenticated) {
      openAuthPrompt('login')
      return
    }
    setActiveItem(item)
    setCommentOpen(true)
  }

  const handleVisitStore = (item) => {
    if (!isAuthenticated) {
      openAuthPrompt('login')
      return
    }
    if (item.foodPartner) {
      navigate(`/food-partner/${item.foodPartner}`)
    }
  }

  const handleCommentSubmit = async (text) => {
    if (!activeItem) return

    try {
      const response = await axios.post(
        'http://localhost:3000/api/food/comment',
        { foodId: activeItem._id, text },
        { withCredentials: true }
      )

      const savedComment = response.data.comment
      const updatedCount = response.data.commentsCount

      setVideos((prevVideos) => prevVideos.map((video) => (
        video._id === activeItem._id
          ? {
            ...video,
            comments: [...(video.comments ?? []), savedComment],
            commentsCount: updatedCount,
          }
          : video
      )))

      setCommentsByItem((prev) => {
        const existing = prev[activeItem._id] ?? activeItem.comments ?? []
        return {
          ...prev,
          [activeItem._id]: [...existing, savedComment],
        }
      })

      setActiveItem((prev) => prev ? {
        ...prev,
        comments: [...(prev.comments ?? []), savedComment],
        commentsCount: updatedCount,
      } : prev)
    } catch (err) {
      if (err.response?.status === 401) {
        openAuthPrompt('login')
      }
    }
  }

  const currentComments = activeItem ? (commentsByItem[activeItem._id] ?? activeItem.comments ?? []) : []

  return (
    <>
      <ReelFeed
        items={videos}
        onLike={handleLike}
        onSave={handleSave}
        onComment={handleCommentClick}
        onVisitStore={handleVisitStore}
        emptyMessage="No videos available."
      />

      <LoginPopup open={authPromptOpen} mode={authPromptMode} onClose={() => setAuthPromptOpen(false)} />

      <CommentModal
        open={commentOpen}
        item={activeItem}
        comments={currentComments}
        currentUser={currentUserName}
        onClose={() => setCommentOpen(false)}
        onSubmit={handleCommentSubmit}
      />
    </>
  )
}

export default Home