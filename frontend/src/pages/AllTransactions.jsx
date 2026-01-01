import { useState, useEffect, useMemo } from 'react'
import TransactionList from '../components/TransactionList'
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import './AllTransactions.css'

function AllTransactions() {
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [domainFilter, setDomainFilter] = useState('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        fetchTransactions()
        fetchCategories()
    }, [])

    const fetchCategories = () => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error('Error fetching categories:', err))
    }

    const fetchTransactions = () => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(err => console.error('Error fetching transactions:', err))
    }

    const handleDeleted = (id) => {
        setTransactions(transactions.filter(t => t.id !== id))
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesType = typeFilter === 'ALL' || t.type === typeFilter
            const matchesDomain = domainFilter === 'ALL' || t.category?.id.toString() === domainFilter
            return matchesSearch && matchesType && matchesDomain
        })
    }, [transactions, searchTerm, typeFilter, domainFilter])

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredTransactions.slice(start, start + itemsPerPage)
    }, [filteredTransactions, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, typeFilter, domainFilter])

    return (
        <div className="all-transactions-page">
            <div className="header-row">
                <div>
                    <h1>Transaction Log</h1>
                    <p className="subtitle">All your recorded transactions in one place</p>
                </div>
                <Link to="/add-transaction" className="add-btn">
                    <Plus size={20} />
                    <span>Add New</span>
                </Link>
            </div>

            <div className="controls-row">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <div className="filter-select">
                        <Filter size={16} />
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                            <option value="ALL">All Types</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>
                    <div className="filter-select">
                        <Filter size={16} />
                        <select value={domainFilter} onChange={(e) => setDomainFilter(e.target.value)}>
                            <option value="ALL">All Domains</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="list-wrapper">
                <TransactionList transactions={paginatedTransactions} onDeleted={handleDeleted} />
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    )
}

export default AllTransactions
