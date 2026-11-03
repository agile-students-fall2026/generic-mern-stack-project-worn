import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/authContext'
import AppLayout from './layouts/AppLayout'
import AddItemPage from './pages/AddItemPage'
import BulkLogPage from './pages/BulkLogPage'
import ClosetPage from './pages/ClosetPage'
import ClosetSummaryPage from './pages/ClosetSummaryPage'
import DashboardPage from './pages/DashboardPage'
import EditItemPage from './pages/EditItemPage'
import ItemDetailPage from './pages/ItemDetailPage'
import ItemRankingsPage from './pages/ItemRankingsPage'
import LogInPage from './pages/LogInPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import SignUpPage from './pages/SignUpPage'
import SpendByCategoryPage from './pages/SpendByCategoryPage'
import WelcomePage from './pages/WelcomePage'

function RequireAuth() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Outlet /> : <Navigate to="/welcome" replace />
}

function LoggedOutOnly() {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Navigate to="/closet" replace /> : <Outlet />
}

export default function App() {
  const { isLoggedIn } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? '/closet' : '/welcome'} replace />} />
        <Route element={<LoggedOutOnly />}>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LogInPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/closet" element={<ClosetPage />} />
            <Route path="/closet/new" element={<AddItemPage />} />
            <Route path="/closet/:itemId" element={<ItemDetailPage />} />
            <Route path="/closet/:itemId/edit" element={<EditItemPage />} />
            <Route path="/closet/:itemId/bulk-log" element={<BulkLogPage />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/summary" element={<ClosetSummaryPage />} />
            <Route path="/dashboard/rankings" element={<ItemRankingsPage />} />
            <Route path="/dashboard/categories" element={<SpendByCategoryPage />} />

            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
