import { ToastContainer } from 'react-toastify'
import useRouterElements from './useRouterElements'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { AppContext } from './context/App.context'
import { LocalStorageEventTarget } from './utils/auth'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from './context/App.context'
import ErrorBoundary from './components/ErrorBoundary'

import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0 // khi gọi api bị thất bại thì sẽ không gọi lại nữa, mặc định nó sẽ gọi lại 3 lần
    }
  }
})

function App() {
  const routesElement = useRouterElements()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    // nó lắng nghe nơi mà nó chạy trong hàm clearLS trong file src/utils/auth.ts ở trong hàm clearLS có dispatch tới sự kiện có tên là 'clearLS' thì thằng này sẽ được chạy
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    // hàm này sẽ chạy và chạy hàm reset
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <ErrorBoundary>
            {routesElement}
            <ToastContainer />
          </ErrorBoundary>
        </AppProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  )
}

export default App
