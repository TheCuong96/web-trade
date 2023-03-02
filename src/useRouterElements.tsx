import React, { useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import Register from './pages/Register'
import ProductList from './pages/ProductList'
import Login from './pages/Login'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import Profile from './pages/Profile'
import { AppContext } from './context/App.context'
export default function useRouterElements() {
  const { isAuthenticated } = useContext(AppContext)
  const ProtectedRoute = () => {
    return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
  }
  const RejectedRoute = () => {
    return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
  }
  const routesElement = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <ProductList />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/profile',
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '/register',
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        },
        {
          path: '/login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        }
      ]
    }
  ])

  return routesElement
}
