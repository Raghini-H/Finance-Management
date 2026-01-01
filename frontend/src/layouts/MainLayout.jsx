import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './MainLayout.css'

function MainLayout() {
    return (
        <div className="layout">
            <Navbar />
            <main className="content">
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout
