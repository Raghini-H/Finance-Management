import { Calendar, ArrowUpCircle, ArrowDownCircle, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import './Tracker.css'

function Tracker() {
    const [monthlyStats, setMonthlyStats] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [expandedMonth, setExpandedMonth] = useState(null)
    const itemsPerPage = 6

    useEffect(() => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => {
                const months = {}
                data.forEach(t => {
                    const date = new Date(t.date)
                    const month = date.getMonth()
                    const year = date.getFullYear()
                    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })

                    if (!months[monthYear]) {
                        const lastDay = new Date(year, month + 1, 0).getDate()
                        const shortYear = year.toString().slice(-2)
                        const mNum = month + 1

                        months[monthYear] = {
                            income: 0,
                            expenses: 0,
                            weeks: {
                                [`1/${mNum}/${shortYear} - 7/${mNum}/${shortYear}`]: { income: 0, expenses: 0 },
                                [`8/${mNum}/${shortYear} - 14/${mNum}/${shortYear}`]: { income: 0, expenses: 0 },
                                [`15/${mNum}/${shortYear} - 21/${mNum}/${shortYear}`]: { income: 0, expenses: 0 },
                                [`22/${mNum}/${shortYear} - ${lastDay}/${mNum}/${shortYear}`]: { income: 0, expenses: 0 }
                            }
                        }
                    }

                    const day = date.getDate()
                    const mNum = month + 1
                    const shortYear = year.toString().slice(-2)
                    let weekKey

                    if (day <= 7) weekKey = `1/${mNum}/${shortYear} - 7/${mNum}/${shortYear}`
                    else if (day <= 14) weekKey = `8/${mNum}/${shortYear} - 14/${mNum}/${shortYear}`
                    else if (day <= 21) weekKey = `15/${mNum}/${shortYear} - 21/${mNum}/${shortYear}`
                    else {
                        const lastDay = new Date(year, month + 1, 0).getDate()
                        weekKey = `22/${mNum}/${shortYear} - ${lastDay}/${mNum}/${shortYear}`
                    }

                    if (t.type === 'INCOME') {
                        months[monthYear].income += t.amount
                        months[monthYear].weeks[weekKey].income += t.amount
                    } else {
                        months[monthYear].expenses += t.amount
                        months[monthYear].weeks[weekKey].expenses += t.amount
                    }
                })

                setMonthlyStats(Object.entries(months).reverse())
            })
    }, [])

    const filtered = useMemo(() => {
        return monthlyStats.filter(([month]) => month.toLowerCase().includes(searchTerm.toLowerCase()))
    }, [monthlyStats, searchTerm])

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const paginated = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filtered.slice(start, start + itemsPerPage)
    }, [filtered, currentPage])

    useEffect(() => setCurrentPage(1), [searchTerm])

    return (
        <div className="tracker">
            <div className="tracker-header">
                <h1>Monthly Income Tracker</h1>
                <div className="tracker-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Filter by month or year..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="months-list">
                {paginated.map(([month, stats]) => (
                    <div key={month} className={`month-card-wrapper ${expandedMonth === month ? 'expanded' : ''}`}>
                        <div
                            className="month-card"
                            onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
                        >
                            <div className="month-header">
                                <div className="month-title">
                                    <Calendar size={20} />
                                    <h3>{month}</h3>
                                </div>
                                <div className="month-summary">
                                    <div className="summary-item income">
                                        <ArrowUpCircle size={16} />
                                        <span>${stats.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="summary-item expense">
                                        <ArrowDownCircle size={16} />
                                        <span>${stats.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{
                                        width: `${Math.min((stats.expenses / stats.income) * 100 || 0, 100)}%`,
                                        background: stats.expenses > stats.income ? 'linear-gradient(90deg, #f87171, #ef4444)' : 'linear-gradient(90deg, #6366f1, #a855f7)'
                                    }}
                                />
                            </div>
                            <div className="card-right">
                                <p className="savings-info">
                                    Savings: <span className={stats.income - stats.expenses >= 0 ? 'pos' : 'neg'}>
                                        ${(stats.income - stats.expenses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </p>
                                {expandedMonth === month ? <ChevronUp size={20} className="expand-icon" /> : <ChevronDown size={20} className="expand-icon" />}
                            </div>
                        </div>

                        {expandedMonth === month && (
                            <div className="weekly-breakdown">
                                <div className="breakdown-header">
                                    <span>Weekly Breakdown</span>
                                </div>
                                <div className="weeks-grid">
                                    {Object.entries(stats.weeks).map(([week, wStats]) => (
                                        (wStats.income > 0 || wStats.expenses > 0) && (
                                            <div key={week} className="weekly-row">
                                                <span className="week-name" style={{ fontSize: '0.95rem', minWidth: '150px' }}>{week}</span>
                                                <div className="week-bars">
                                                    <div className="week-bar-container">
                                                        <div className="bar-label">In: ${wStats.income.toFixed(0)}</div>
                                                        <div className="mini-progress">
                                                            <div className="progress-fill income" style={{ width: `${Math.min((wStats.income / stats.income) * 100, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="week-bar-container">
                                                        <div className="bar-label">Out: ${wStats.expenses.toFixed(0)}</div>
                                                        <div className="mini-progress">
                                                            <div className="progress-fill expense" style={{ width: `${Math.min((wStats.expenses / (stats.expenses || 1)) * 100, 100)}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`week-result ${wStats.income - wStats.expenses >= 0 ? 'pos' : 'neg'}`}>
                                                    ${(wStats.income - wStats.expenses).toFixed(0)}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
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

export default Tracker

