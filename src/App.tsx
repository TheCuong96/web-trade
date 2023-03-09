import { ToastContainer } from 'react-toastify'
import useRouterElements from './useRouterElements'
import 'react-toastify/dist/ReactToastify.css'
import { useContext, useEffect } from 'react'
import { AppContext } from './context/App.context'
import { LocalStorageEventTarget } from './utils/auth'

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
    <div>
      {routesElement}
      <ToastContainer />
    </div>
  )
}

export default App
