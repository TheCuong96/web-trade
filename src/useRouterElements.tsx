import React from 'react'
import { useRoutes } from 'react-router-dom'
import Register from './pages/Register'
import ProductList from './pages/ProductList'
import Login from './pages/Login'
import RegisterLayout from './layouts/RegisterLayout'
export default function useRouterElements() {
  const routesElement = useRoutes([
    {
      path: '/',
      element: <ProductList />
    },
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
  ])

  return routesElement
}
