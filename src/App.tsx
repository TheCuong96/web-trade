import useRouterElements from './useRouterElements'

function App() {
  const routesElement = useRouterElements()
  return <div>{routesElement}</div>
}

export default App
