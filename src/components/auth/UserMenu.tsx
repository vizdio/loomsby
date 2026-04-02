import { Link } from 'react-router-dom'
import { ROUTES } from '../../lib/constants'
import { useAuth } from '../../hooks/useAuth'

export function UserMenu() {
  const { user, signOut } = useAuth()

  if (!user) {
    return (
      <div className="row gap-sm">
        <Link to={ROUTES.login}>Login</Link>
        <Link to={ROUTES.signup}>Sign up</Link>
      </div>
    )
  }

  return (
    <div className="row gap-sm">
      <span className="muted-text">{user.email}</span>
      <button className="btn-danger" onClick={() => void signOut()}>
        Sign out
      </button>
    </div>
  )
}
