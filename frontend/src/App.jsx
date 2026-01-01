import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import MonthlyHistory from './pages/MonthlyHistory'
import Domains from './pages/Domains'
import Tracker from './pages/Tracker'
import AddTransaction from './pages/AddTransaction'
import AllTransactions from './pages/AllTransactions'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-transaction" element={<AddTransaction />} />
          <Route path="transactions" element={<AllTransactions />} />
          <Route path="history" element={<MonthlyHistory />} />
          <Route path="domains" element={<Domains />} />
          <Route path="tracker" element={<Tracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
