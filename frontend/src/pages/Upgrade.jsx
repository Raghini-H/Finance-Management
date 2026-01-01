import { Zap, Check } from 'lucide-react'
import './Upgrade.css'

function Upgrade() {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            features: ['Basic charts', 'Manual entry', '1 Month History'],
            current: true
        },
        {
            name: 'Pro',
            price: '$9.99',
            features: ['Advanced Analytics', 'Bank Sync', 'Unlimited History', 'Export PDF/CSV'],
            current: false,
            highlight: true
        }
    ]

    return (
        <div className="upgrade">
            <h1>Upgrade to Pro</h1>
            <p className="subtitle">Unlock powerful features to master your finances.</p>

            <div className="plans-grid">
                {plans.map(plan => (
                    <div key={plan.name} className={`plan-card ${plan.highlight ? 'highlight' : ''}`}>
                        {plan.highlight && <div className="badge">Recommended</div>}
                        <div className="plan-header">
                            <h3>{plan.name}</h3>
                            <div className="price">{plan.price}<span>/mo</span></div>
                        </div>
                        <ul className="features">
                            {plan.features.map(f => (
                                <li key={f}>
                                    <Check size={16} />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                        <button className={`plan-btn ${plan.current ? 'disabled' : ''}`}>
                            {plan.current ? 'Current Plan' : 'Go Premium'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Upgrade
