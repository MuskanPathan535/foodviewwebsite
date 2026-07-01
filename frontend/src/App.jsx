
import './App.css'
import './styles/theme.css'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
