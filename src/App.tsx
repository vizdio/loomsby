import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { UserMenu } from './components/auth/UserMenu'
import { ROUTES } from './lib/constants'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { BoardsPage } from './pages/BoardsPage'
import { ChatPage } from './pages/ChatPage'
import { BuilderPage } from './pages/BuilderPage'
import { ProfilePage } from './pages/ProfilePage'

function App() {
    return (
        <div className="app-shell">
            <header className="top-nav">
                <Link to={ROUTES.home} className="brand">
                    Loomsby
                </Link>
                <nav className="row gap-sm wrap">
                    <Link to={ROUTES.boards}>Boards</Link>
                    <Link to={ROUTES.chat}>Chat</Link>
                    <Link to={ROUTES.builder}>Builder</Link>
                    <Link to={ROUTES.profile}>Profile</Link>
                </nav>
                <UserMenu />
            </header>

            <Routes>
                <Route path={ROUTES.home} element={<HomePage />} />
                <Route path={ROUTES.login} element={<LoginPage />} />
                <Route path={ROUTES.signup} element={<SignupPage />} />
                <Route path={ROUTES.boards} element={<BoardsPage />} />
                <Route path={ROUTES.chat} element={<ChatPage />} />
                <Route path={ROUTES.builder} element={<BuilderPage />} />
                <Route path={ROUTES.profile} element={<ProfilePage />} />
                <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
            </Routes>
        </div>
    )
}

export default App
