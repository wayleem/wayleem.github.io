import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/sidebar"
import Home from "./components/home"

function App() {
  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar />
      <Home />
    </div>
  )
}

export default App
