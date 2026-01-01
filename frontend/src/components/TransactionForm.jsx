import { useState, useEffect } from 'react'
import { FileText, DollarSign, Layout, Wallet, ArrowUpDown, Calendar as CalendarIcon, Plus } from 'lucide-react'
import DatePicker from './DatePicker'
import './TransactionForm.css'

function TransactionForm({ onTransactionAdded }) {
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('EXPENSE')
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [categoryId, setCategoryId] = useState('')
    const [paymentMode, setPaymentMode] = useState('CASH')
    const [categories, setCategories] = useState([])

    const PAYMENT_MODES = ['CASH', 'CARD', 'UPI', 'OTHER']

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                const cats = Array.isArray(data) ? data : []
                setCategories(cats)
                if (cats.length > 0) setCategoryId(cats[0].id)
            })
            .catch(() => setCategories([]))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        const transaction = {
            description,
            amount: parseFloat(amount),
            type,
            date,
            paymentMode,
            category: { id: parseInt(categoryId) }
        }

        fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        })
            .then(res => res.json())
            .then(data => {
                onTransactionAdded(data)
                setDescription('')
                setAmount('')
            })
            .catch(err => console.error('Error adding transaction:', err))
    }

    return (
        <form className="modern-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-item full">
                    <label><FileText size={16} /> Description</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="What was this for?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-item">
                    <label><DollarSign size={16} /> Amount</label>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-item">
                    <label><ArrowUpDown size={16} /> Transaction Type</label>
                    <div className="input-wrapper">
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-item">
                    <label><Layout size={16} /> Domain</label>
                    <div className="input-wrapper">
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                            <option value="">Select Domain</option>
                            {Array.isArray(categories) && categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-item">
                    <label><Wallet size={16} /> Payment Mode</label>
                    <div className="input-wrapper">
                        <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} required>
                            {PAYMENT_MODES.map(mode => (
                                <option key={mode} value={mode}>{mode}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-item full">
                    <DatePicker
                        label={<><CalendarIcon size={16} /> Date</>}
                        value={date}
                        onChange={setDate}
                    />
                </div>
            </div>

            <button type="submit" className="modern-submit-btn">
                <Plus size={20} />
                <span>Add Transaction</span>
            </button>
        </form>
    )
}

export default TransactionForm
