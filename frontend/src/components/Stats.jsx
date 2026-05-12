import { Users, Package, Globe, Star } from 'lucide-react'
import { useCounter } from '../hooks/useScrollAnimation'

const items = [
  { icon: Users,   end: 100,  suffix: '+', label: 'Clientes Activos'    },
  { icon: Package, end: 1500, suffix: '+', label: 'Pedidos Completados' },
  { icon: Globe,   end: 24,   suffix: '',  label: 'Departamentos'       },
  { icon: Star,    end: 98,   suffix: '%', label: 'Satisfacción'        },
]

function CounterCard({ item }) {
  const ref = useCounter(item.end)
  const Icon = item.icon
  return (
    <div className="stat-card reveal">
      <div className="stat-icon">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <div className="stat-number">
        <span ref={ref}>0</span>
        <span className="suffix">{item.suffix}</span>
      </div>
      <div className="stat-text">{item.label}</div>
    </div>
  )
}

const tickerData = [
  { num: '+100',    label: 'Clientes'      },
  { num: 'Nacional', label: 'Cobertura'   },
  { num: 'Stock',   label: 'Permanente'   },
  { num: '+15',     label: 'Categorías'   },
  { num: '24H',     label: 'Respuesta'    },
  { num: 'Mín. 12', label: 'Unidades'    },
  { num: 'Original', label: 'Garantizado' },
  { num: '+100',    label: 'Clientes'      },
  { num: 'Nacional', label: 'Cobertura'   },
  { num: 'Stock',   label: 'Permanente'   },
  { num: '+15',     label: 'Categorías'   },
  { num: '24H',     label: 'Respuesta'    },
  { num: 'Mín. 12', label: 'Unidades'    },
  { num: 'Original', label: 'Garantizado' },
]

export function StatsTicker() {
  return (
    <div className="stats-ticker">
      <div className="ticker-track">
        {tickerData.map((item, i) => (
          <div className="ticker-item" key={i}>
            <span className="ticker-num">{item.num}</span>
            <span className="ticker-dot" />
            <span className="ticker-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {items.map(item => (
            <CounterCard key={item.label} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
