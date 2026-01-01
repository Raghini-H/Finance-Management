import { useEffect, useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { TrendingUp, TrendingDown, Wallet, Calendar } from 'lucide-react'
import './Dashboard.css'

function Dashboard() {
    const [transactions, setTransactions] = useState([])
    const [selectedPeriod, setSelectedPeriod] = useState('') // Format: "Month Year"
    const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 })
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => {
                setTransactions(data)

                // Default to current month/year
                const now = new Date()
                const currentPeriod = now.toLocaleString('default', { month: 'long', year: 'numeric' })
                setSelectedPeriod(currentPeriod)
            })
    }, [])

    const availablePeriods = useMemo(() => {
        const periods = new Set()
        transactions.forEach(t => {
            const d = new Date(t.date)
            periods.add(d.toLocaleString('default', { month: 'long', year: 'numeric' }))
        })

        // Ensure current month is always there
        const now = new Date()
        periods.add(now.toLocaleString('default', { month: 'long', year: 'numeric' }))

        const sorted = Array.from(periods).sort((a, b) => new Date(b) - new Date(a))
        return sorted
    }, [transactions])

    useEffect(() => {
        if (!selectedPeriod) return

        // Monthly Stats for selected period
        const periodTransactions = transactions.filter(t => {
            const d = new Date(t.date)
            return d.toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedPeriod
        })

        const monthlyIncome = periodTransactions
            .filter(t => t.type === 'INCOME')
            .reduce((acc, t) => acc + t.amount, 0)

        const monthlyExpenses = periodTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, t) => acc + t.amount, 0)

        // Lifetime Balance
        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((acc, t) => acc + t.amount, 0)

        const totalExpenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((acc, t) => acc + t.amount, 0)

        setSummary({
            balance: totalIncome - totalExpenses,
            income: monthlyIncome,
            expenses: monthlyExpenses
        })

        setChartData([
            { name: 'Income', value: monthlyIncome, color: '#4ade80' },
            { name: 'Expenses', value: monthlyExpenses, color: '#f87171' }
        ])
    }, [transactions, selectedPeriod])

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="title-area">
                    <h1>Dashboard Overview</h1>
                    <p>Financial summary for {selectedPeriod}</p>
                </div>

                <div className="period-selector-wrapper">
                    <Calendar size={18} />
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="period-dropdown"
                    >
                        {availablePeriods.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card balance">
                    <div className="stat-info">
                        <span className="label">Total Balance (Lifetime)</span>
                        <span className="value">${summary.balance.toFixed(2)}</span>
                    </div>
                    <Wallet className="icon" size={32} />
                </div>
                <div className="stat-card income">
                    <div className="stat-info">
                        <span className="label">Income ({selectedPeriod})</span>
                        <span className="value">+${summary.income.toFixed(2)}</span>
                    </div>
                    <TrendingUp className="icon" size={32} />
                </div>
                <div className="stat-card expenses">
                    <div className="stat-info">
                        <span className="label">Expenses ({selectedPeriod})</span>
                        <span className="value">-${summary.expenses.toFixed(2)}</span>
                    </div>
                    <TrendingDown className="icon" size={32} />
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h3>{selectedPeriod} Breakdown</h3>
                    <div className="chart-wrapper">
                        {summary.income === 0 && summary.expenses === 0 ? (
                            <div className="no-data-msg">No transactions found for this period.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
