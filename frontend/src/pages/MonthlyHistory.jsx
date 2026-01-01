import { useState, useEffect, useMemo } from 'react'
import { Calendar, Edit2, Trash2, Filter, X, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import './MonthlyHistory.css'

function MonthlyHistory() {
    const [transactions, setTransactions] = useState([])
    const [groupedTransactions, setGroupedTransactions] = useState({})
    const [categories, setCategories] = useState([])
    const [editingTransaction, setEditingTransaction] = useState(null)
    const [editForm, setEditForm] = useState({ description: '', amount: '', date: '', type: 'EXPENSE', categoryId: '', paymentMode: 'CASH' })
    const [selectedPeriod, setSelectedPeriod] = useState('ALL')
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3

    useEffect(() => {
        fetchTransactions()
        fetchCategories()
    }, [])

    const fetchCategories = () => {
        fetch('/api/categories')
            .then(res => res.ok ? res.json() : [])
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => setCategories([]))
    }

    const fetchTransactions = () => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setTransactions(data)
                    groupTransactions(data)
                }
            })
            .catch(err => console.error('Error:', err))
    }

    const groupTransactions = (data) => {
        const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
        const grouped = sorted.reduce((acc, t) => {
            const date = new Date(t.date)
            const key = date.toLocaleString('default', { month: 'long', year: 'numeric' })
            if (!acc[key]) acc[key] = []
            acc[key].push(t)
            return acc
        }, {})
        setGroupedTransactions(grouped)
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            fetch(`/api/transactions/${id}`, { method: 'DELETE' })
                .then(() => fetchTransactions())
                .catch(err => console.error('Error:', err))
        }
    }

    const startEdit = (t) => {
        setEditingTransaction(t)
        setEditForm({
            description: t.description,
            amount: t.amount,
            date: t.date,
            type: t.type,
            categoryId: t.category?.id || '',
            paymentMode: t.paymentMode || 'CASH'
        })
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        const payload = {
            ...editForm,
            category: editForm.categoryId ? { id: parseInt(editForm.categoryId) } : null
        }
        fetch(`/api/transactions/${editingTransaction.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(() => {
                setEditingTransaction(null)
                fetchTransactions()
            })
            .catch(err => console.error('Error:', err))
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesType = typeFilter === 'ALL' || t.type === typeFilter
            return matchesSearch && matchesType
        })
    }, [transactions, searchTerm, typeFilter])

    const groupedFilteredTransactions = useMemo(() => {
        const sorted = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date))
        return sorted.reduce((acc, t) => {
            const date = new Date(t.date)
            const key = date.toLocaleString('default', { month: 'long', year: 'numeric' })
            if (!acc[key]) acc[key] = []
            acc[key].push(t)
            return acc
        }, {})
    }, [filteredTransactions])

    const availablePeriods = Object.keys(groupedFilteredTransactions)
    const baseGroups = selectedPeriod === 'ALL'
        ? Object.entries(groupedFilteredTransactions)
        : Object.entries(groupedFilteredTransactions).filter(([key]) => key === selectedPeriod)

    const totalPages = Math.ceil(baseGroups.length / itemsPerPage)
    const paginatedGroups = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return baseGroups.slice(start, start + itemsPerPage)
    }, [baseGroups, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, typeFilter, selectedPeriod])

    return (
        <div className="history-page">
            <div className="header-section">
                <div className="title-area">
                    <h1>Transaction History</h1>
                    <p>Found {filteredTransactions.length} results in {baseGroups.length} months</p>
                </div>

                <div className="filter-controls">
                    <div className="search-wrapper">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="history-search"
                        />
                    </div>
                    <div className="selector-wrapper">
                        <Filter size={16} />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="period-select"
                        >
                            <option value="ALL">All Types</option>
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>
                    <div className="selector-wrapper">
                        <Calendar size={16} />
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="period-select"
                        >
                            <option value="ALL">All Time</option>
                            {availablePeriods.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                    {(selectedPeriod !== 'ALL' || searchTerm || typeFilter !== 'ALL') && (
                        <button className="clear-filter" onClick={() => {
                            setSelectedPeriod('ALL')
                            setSearchTerm('')
                            setTypeFilter('ALL')
                        }}>
                            <X size={14} />
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {paginatedGroups.length > 0 ? (
                <>
                    {paginatedGroups.map(([month, items]) => (
                        <div key={month} className="month-group">
                            <div className="month-label">
                                <Calendar size={18} />
                                {month}
                                <span className="item-count">{items.length} transactions</span>
                            </div>
                            <div className="transaction-table-wrapper">
                                <table className="transaction-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Domain</th>
                                            <th>Mode</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(t => (
                                            <tr key={t.id} className={t.type.toLowerCase()}>
                                                <td>{new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</td>
                                                <td>{t.description}</td>
                                                <td>
                                                    <span className="domain-pill" style={{ '--domain-color': t.category?.color || '#334155' }}>
                                                        {t.category?.name || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td><span className="mode-badge">{t.paymentMode || 'CASH'}</span></td>
                                                <td><span className={`type-badge ${t.type.toLowerCase()}`}>{t.type}</span></td>
                                                <td className="amount-cell">
                                                    {t.type === 'INCOME' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                                                </td>
                                                <td className="actions-cell">
                                                    <button onClick={() => startEdit(t)} className="action-btn edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(t.id)} className="action-btn delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

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
                </>
            ) : (
                <div className="no-transactions">
                    <div className="empty-state">
                        <Calendar size={48} opacity={0.2} />
                        <p>No transactions found for this period.</p>
                        <button className="reset-btn" onClick={() => setSelectedPeriod('ALL')}>View All History</button>
                    </div>
                </div>
            )}

            {editingTransaction && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <h2>Edit Transaction</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={editForm.description}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Amount</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editForm.amount}
                                        onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type</label>
                                    <select
                                        value={editForm.type}
                                        onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                    >
                                        <option value="INCOME">Income</option>
                                        <option value="EXPENSE">Expense</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Domain</label>
                                <select
                                    value={editForm.categoryId}
                                    onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Domain</option>
                                    {Array.isArray(categories) && categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    value={editForm.date}
                                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Payment Mode</label>
                                <select
                                    value={editForm.paymentMode}
                                    onChange={e => setEditForm({ ...editForm, paymentMode: e.target.value })}
                                    required
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="CARD">Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setEditingTransaction(null)} className="cancel-btn">Cancel</button>
                                <button type="submit" className="save-btn">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MonthlyHistory
