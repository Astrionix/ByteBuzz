import { type ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'
import LogoMark from '../shared/LogoMark'

type NavItem = {
  to: string
  label: string
}

const navItems: NavItem[] = [
  { to: '/', label: 'Experience' },
  { to: '/menu', label: 'Menu' },
  { to: '/feedback', label: 'Feedback' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

type AppLayoutProps = {
  children?: ReactNode
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brandRow}>
          <LogoMark />
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
              }
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      {children && (
        <div className={styles.floating}>
          {children}
        </div>
      )}
    </div>
  )
}

export default AppLayout
