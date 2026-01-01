import { useState, useEffect, useMemo } from 'react'
import { Plus, Trash2, Hexagon, ChevronDown, ChevronUp, Clock, Tag, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import './Domains.css'

const COLORS = ['#f87171', '#4ade80', '#6366f1', '#fbbf24', '#a855f7', '#2dd4bf', '#f472b6', '#94a3b8']

function DomainTransactionsList({ transactions, color }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    const filtered = useMemo(() => {
        return transactions.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [transactions, searchTerm])

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filtered.slice(start, start + itemsPerPage)
    }, [filtered, currentPage])

    useEffect(() => setCurrentPage(1), [searchTerm])

    return (
        <div className="domain-transactions-list" style={{ borderLeftColor: color }}>
            <div className="inner-search">
                <Search size={14} />
                <input
                    type="text"
                    placeholder="Search inside this domain..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {paginated.length > 0 ? (
                <div className="mini-table">
                    <div className="mini-header">
                        <span>Date</span>
                        <span>Description</span>
                        <span>Mode</span>
                        <span className="text-right">Amount</span>
                    </div>
                    {paginated.map(t => (
                        <div key={t.id} className="mini-row">
                            <span className="date">{new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            <span className="desc">{t.description}</span>
                            <span className="mode">{t.paymentMode || 'CASH'}</span>
                            <span className={`amt ${t.type.toLowerCase()}`}>
                                {t.type === 'INCOME' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                            </span>
                        </div>
                    ))}
                    {totalPages > 1 && (
                        <div className="inner-pagination">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                <ChevronLeft size={14} />
                            </button>
                            <span>{currentPage} / {totalPages}</span>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="empty-domain">No matching transactions found</div>
            )}
        </div>
    )
}

function Domains() {
    const [categories, setCategories] = useState([])
    const [transactions, setTransactions] = useState([])
    const [showAdd, setShowAdd] = useState(false)
    const [expandedDomain, setExpandedDomain] = useState(null)
    const [form, setForm] = useState({ name: '', icon: 'Tag', color: '#f87171' })
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    useEffect(() => {
        fetchCategories()
        fetchTransactions()
    }, [])

    const fetchCategories = () => {
        fetch('/api/categories')
            .then(res => res.ok ? res.json() : [])
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => setCategories([]))
    }

    const fetchTransactions = () => {
        fetch('/api/transactions')
            .then(res => res.ok ? res.json() : [])
            .then(data => setTransactions(Array.isArray(data) ? data : []))
            .catch(() => setTransactions([]))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        }).then(() => {
            setShowAdd(false)
            fetchCategories()
        })
    }

    const handleDelete = (id) => {
        if (window.confirm('Delete this domain? Transactions in this domain will lose their grouping.')) {
            fetch(`/api/categories/${id}`, { method: 'DELETE' })
                .then(() => fetchCategories())
        }
    }

    const filteredCategories = useMemo(() => {
        return categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [categories, searchTerm])

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
    const paginatedCategories = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredCategories.slice(start, start + itemsPerPage)
    }, [filteredCategories, currentPage])

    useEffect(() => setCurrentPage(1), [searchTerm])

    const getTransactionsForDomain = (domainId) => {
        return transactions.filter(t => t.category?.id === domainId)
    }

    return (
        <div className="domains-page">
            <div className="header-action">
                <div className="title-group">
                    <h1>Finance Domains</h1>
                    <p>Organize your transactions into logical groups ({filteredCategories.length})</p>
                </div>
                <div className="domain-controls">
                    <div className="main-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Find a domain..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="add-domain-btn" onClick={() => setShowAdd(true)}>
                        <Plus size={20} />
                        <span>New Domain</span>
                    </button>
                </div>
            </div>

            <div className="domains-list">
                {paginatedCategories.map(cat => {
                    const domainTransactions = getTransactionsForDomain(cat.id)
                    const isExpanded = expandedDomain === cat.id

                    return (
                        <div key={cat.id} className={`domain-card-wrapper ${isExpanded ? 'expanded' : ''}`}>
                            <div
                                className="domain-card"
                                style={{ '--domain-color': cat.color }}
                                onClick={() => setExpandedDomain(isExpanded ? null : cat.id)}
                            >
                                <div className="domain-icon">
                                    <Hexagon size={44} fill={cat.color} stroke="none" opacity={0.15} />
                                    <div className="icon-foreground">{cat.name.charAt(0)}</div>
                                </div>
                                <div className="domain-info">
                                    <h3>{cat.name}</h3>
                                    <div className="stats-row">
                                        <span className="count-badge">
                                            <Clock size={12} />
                                            {domainTransactions.length} items
                                        </span>
                                        <span className="total-badge">
                                            ${domainTransactions.reduce((acc, t) => acc + (t.type === 'INCOME' ? t.amount : -t.amount), 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button className="delete-domain" onClick={(e) => { e.stopPropagation(); handleDelete(cat.id); }}>
                                        <Trash2 size={16} />
                                    </button>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {isExpanded && (
                                <DomainTransactionsList transactions={domainTransactions} color={cat.color} />
                            )}
                        </div>
                    )
                })}
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

            {showAdd && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <h2>Create New Domain</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Domain Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Subscriptions"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Theme Color</label>
                                <div className="color-picker">
                                    {COLORS.map(c => (
                                        <div
                                            key={c}
                                            className={`color-box ${form.color === c ? 'active' : ''}`}
                                            style={{ background: c }}
                                            onClick={() => setForm({ ...form, color: c })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowAdd(false)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="save-btn">Create Domain</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Domains
