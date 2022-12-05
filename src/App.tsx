import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/sidebar"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Sidebar />} />
      </Routes >
    </>
  )
}

export default App
