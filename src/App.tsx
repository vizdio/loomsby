import { type ReactNode } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { UserMenu } from './components/auth/UserMenu'
import { useAuth } from './hooks/useAuth'
import { ROUTES } from './lib/constants'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { BoardsPage } from './pages/BoardsPage'
import { ChatPage } from './pages/ChatPage'
import { BuilderPage } from './pages/BuilderPage'
import { ProfilePage } from './pages/ProfilePage'

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <main className="page">Loading...</main>
    }

    if (!user) {
        return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />
    }

    return <>{children}</>
}

function App() {
    const { user } = useAuth()

    return (
        <div className="app-shell">
            <header className="top-nav">
                <Link to={ROUTES.home} className="brand">
                    Loomsby
                </Link>
                <nav className="row gap-sm wrap">
                    {user ? (
                        <>
                            <Link to={ROUTES.boards}>Boards</Link>
                            <Link to={ROUTES.chat}>Chat</Link>
                            <Link to={ROUTES.builder}>Builder</Link>
                            <Link to={ROUTES.profile}>Profile</Link>
                        </>
                    ) : null}
                </nav>
                <UserMenu />
            </header>

            <Routes>
                <Route path={ROUTES.home} element={<HomePage />} />
                <Route path={ROUTES.login} element={<LoginPage />} />
                <Route path={ROUTES.signup} element={<SignupPage />} />
                <Route
                    path={ROUTES.boards}
                    element={
                        <ProtectedRoute>
                            <BoardsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.chat}
                    element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.builder}
                    element={
                        <ProtectedRoute>
                            <BuilderPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.profile}
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
            </Routes>
        </div>
    )
}

export default App
