import { Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ExperiencePage from './pages/Experience/ExperiencePage'
import MenuPage from './pages/Menu/MenuPage'
import CeremonyBowlPage from './pages/CeremonyBowl/CeremonyBowlPage'
import FeedbackPage from './pages/Feedback/FeedbackPage'
import LeaderboardPage from './pages/Leaderboard/LeaderboardPage'
import ChatBot from './components/ChatBot/ChatBot'

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<ExperiencePage />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="ceremony-bowl" element={<CeremonyBowlPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Routes>
      <ChatBot />
    </>
  )
}

export default App
