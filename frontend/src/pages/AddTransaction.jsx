import TransactionForm from '../components/TransactionForm'
import { useNavigate } from 'react-router-dom'
import './AddTransaction.css'

function AddTransaction() {
    const navigate = useNavigate()

    const handleTransactionAdded = () => {
        // Redirect to transactions list after adding
        navigate('/transactions')
    }

    return (
        <div className="add-transaction-page">
            <div className="form-container">
                <h1>Add New Transaction</h1>
                <p className="subtitle">Record your income or expenses to track your balance</p>
                <TransactionForm onTransactionAdded={handleTransactionAdded} />
            </div>
        </div>
    )
}

export default AddTransaction
