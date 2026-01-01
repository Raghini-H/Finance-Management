import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Wallet, PieChart, Zap, IndianRupee, Receipt, Folder } from 'lucide-react'
import './Navbar.css'

function Navbar() {
    const location = useLocation()

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <IndianRupee size={24} />
                <span>FinFlow</span>
            </div>
            <ul className="nav-links">
                <li>
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/add-transaction" className={location.pathname === '/add-transaction' ? 'active' : ''}>
                        <PieChart size={20} />
                        <span>Add Transaction</span>
                    </Link>
                </li>
                <li>
                    <Link to="/transactions" className={location.pathname === '/transactions' ? 'active' : ''}>
                        <Receipt size={20} />
                        <span>Recent Transactions</span>
                    </Link>
                </li>
                <li>
                    <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>
                        <Wallet size={20} />
                        <span>Monthly History</span>
                    </Link>
                </li>
                <li>
                    <Link to="/domains" className={location.pathname === '/domains' ? 'active' : ''}>
                        <Folder size={20} />
                        <span>Domains</span>
                    </Link>
                </li>
                <li>
                    <Link to="/tracker" className={location.pathname === '/tracker' ? 'active' : ''}>
                        <Zap size={20} />
                        <span>Income Tracker</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar
