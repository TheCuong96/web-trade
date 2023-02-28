import { ToastContainer } from 'react-toastify'
import useRouterElements from './useRouterElements'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routesElement = useRouterElements()
  return (
    <div>
      {routesElement}
      <ToastContainer />
    </div>
  )
}

export default App
