import './TransactionList.css'

function TransactionList({ transactions, onDeleted }) {
    const handleDelete = (id) => {
        fetch(`/api/transactions/${id}`, { method: 'DELETE' })
            .then(() => onDeleted(id))
            .catch(err => console.error('Error deleting transaction:', err))
    }

    const total = transactions.reduce((acc, t) => {
        return t.type === 'INCOME' ? acc + t.amount : acc - t.amount
    }, 0)

    return (
        <div className="transaction-list-container">
            <div className="balance-card">
                <h3>Total Balance</h3>
                <h2 className={total >= 0 ? 'positive' : 'negative'}>${total.toFixed(2)}</h2>
            </div>
            <div className="transaction-list">
                {transactions.length === 0 ? <p>No transactions found.</p> : (
                    transactions.map(t => (
                        <div key={t.id} className={`transaction-item ${t.type.toLowerCase()}`}>
                            <div className="info">
                                <span className="desc">{t.description}</span>
                                <span className="date">{t.date}</span>
                            </div>
                            <div className="payment-mode-tag">{t.paymentMode || 'CASH'}</div>
                            <div className="amount-actions">
                                <span className="amount">
                                    {t.type === 'INCOME' ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                                </span>
                                <button className="delete-btn" onClick={() => handleDelete(t.id)}>×</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default TransactionList
