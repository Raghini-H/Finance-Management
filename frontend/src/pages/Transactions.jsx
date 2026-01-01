import { useState, useEffect } from 'react'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'

function Transactions() {
    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = () => {
        fetch('/api/transactions')
            .then(res => res.json())
            .then(data => setTransactions(data))
            .catch(err => console.error('Error fetching transactions:', err))
    }

    const handleTransactionAdded = (newTransaction) => {
        setTransactions([newTransaction, ...transactions])
    }

    const handleDeleted = (id) => {
        setTransactions(transactions.filter(t => t.id !== id))
    }

    return (
        <div className="transactions-page">
            <h1>Manage Transactions</h1>
            <TransactionForm onTransactionAdded={handleTransactionAdded} />
            <TransactionList transactions={transactions} onDeleted={handleDeleted} />
        </div>
    )
}

export default Transactions
