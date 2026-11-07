import { useEffect, useRef, useState, type ReactNode } from 'react'

type Screen = 'inicio' | 'ecopuntos' | 'escanear' | 'recompensas' | 'perfil' | 'acerca' | 'privacidad'
type Category = 'Plástico' | 'Vidrio' | 'Papel' | 'Electrónicos'
type Entry = { id: string; date: string; points: number; label: string }
type DemoData = { points: number; history: Entry[] }
type LocationDemo = { name: string; area: string; materials: Category[]; status: string }

const STORE_KEY = 'ecopuntos-urbano-demo-v1'
const initialData: DemoData = { points: 0, history: [] }
const demoLocations: LocationDemo[] = [
  { name: 'Punto DEMO Centro', area: 'Centro histórico · área ilustrativa de Cusco', materials: ['Plástico', 'Papel'], status: 'Ficticio' },
  { name: 'Punto DEMO Wanchaq', area: 'Wanchaq · referencia no verificada', materials: ['Vidrio', 'Electrónicos'], status: 'No verificado' },
  { name: 'Punto DEMO San Sebastián', area: 'San Sebastián · referencia no verificada', materials: ['Plástico', 'Vidrio', 'Papel'], status: 'Ficticio' },
]
const categories: Category[] = ['Plástico', 'Vidrio', 'Papel', 'Electrónicos']
const navItems: { id: Screen; label: string; icon: string }[] = [
  { id: 'inicio', label: 'Inicio', icon: 'home' }, { id: 'ecopuntos', label: 'Ecopuntos', icon: 'pin' },
  { id: 'escanear', label: 'Escanear', icon: 'scan' }, { id: 'recompensas', label: 'Recompensas', icon: 'gift' },
  { id: 'perfil', label: 'Perfil', icon: 'user' },
]

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 9h10v6H7zM10 9v6m4-6v6"/></>,
    gift: <><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9H7a2.5 2.5 0 1 1 2.5-2.5C9.5 8 12 9 12 9Zm0 0h5a2.5 2.5 0 1 0-2.5-2.5C14.5 8 12 9 12 9Z"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></>,
    leaf: <><path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z"/><path d="M4 21c3-6 7-9 13-12"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] ?? paths.info}</svg>
}

function readData(): DemoData {
  try {
    const stored = localStorage.getItem(STORE_KEY)
    if (!stored) return initialData
    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed === 'object' && parsed !== null && 'points' in parsed && 'history' in parsed && typeof parsed.points === 'number' && Array.isArray(parsed.history)) return parsed as DemoData
  } catch { /* Si el almacenamiento no está disponible, la experiencia continúa en memoria. */ }
  return initialData
}

function App() {
  const [screen, setScreen] = useState<Screen>('inicio')
  const [data, setData] = useState<DemoData>(readData)
  const [filter, setFilter] = useState<Category | 'Todos'>('Todos')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3000)
  }
  useEffect(() => () => {
    if (navigationTimer.current) clearTimeout(navigationTimer.current)
    if (toastTimer.current) clearTimeout(toastTimer.current)
  }, [])
  useEffect(() => {
    try {
      if (data.history.length || data.points) localStorage.setItem(STORE_KEY, JSON.stringify(data))
      else localStorage.removeItem(STORE_KEY)
    } catch { showToast('No se pudo guardar en este navegador; los datos solo durarán esta visita.') }
    // showToast tiene identidad variable por render; persistimos únicamente cuando cambia el estado de demostración.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const navigate = (next: Screen) => {
    if (navigationTimer.current) clearTimeout(navigationTimer.current)
    setToast('')
    setLoading(true)
    navigationTimer.current = setTimeout(() => {
      setScreen(next)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
      navigationTimer.current = null
    }, 140)
  }
  const addDemo = () => {
    const entry: Entry = {
      id: `${Date.now()}-${Math.random()}`,
      date: new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
      points: 150,
      label: 'Registro de reciclaje DEMO',
    }
    setData(current => ({ points: current.points + 150, history: [entry, ...current.history] }))
    showToast('+150 EcoPuntos DEMO. No se registró una entrega real.')
  }
  const clearDemo = () => {
    if (window.confirm('¿Borrar el saldo y el historial ficticios guardados en este navegador? Esta acción no se puede deshacer.')) {
      setData(initialData)
      try { localStorage.removeItem(STORE_KEY) } catch { /* El almacenamiento puede estar bloqueado por el navegador. */ }
      showToast('Se borraron los datos de demostración de este navegador.')
    }
  }
  const selectFilter = (value: Category | 'Todos') => {
    setFilter(value)
    showToast(`Filtro DEMO: ${value}`)
  }
  const filteredPoints = demoLocations.filter(point => filter === 'Todos' || point.materials.includes(filter))
  const titles: Record<Screen, string> = { inicio: 'Inicio', ecopuntos: 'Ecopuntos', escanear: 'Escanear', recompensas: 'Recompensas', perfil: 'Mi perfil', acerca: 'Acerca del proyecto', privacidad: 'Privacidad y soporte' }
  const wide = screen === 'acerca' || screen === 'privacidad'

  return <div className={`app-shell${wide ? ' wide-page' : ''}`}>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="topbar">
      <button className="brand" onClick={() => navigate('inicio')} aria-label="EcoPuntos Urbano, ir a Inicio"><span className="brand-mark"><Icon name="leaf" size={22}/></span><span><strong>EcoPuntos</strong><small>URBANO · CUSCO</small></span></button>
      <span className="demo-chip"><span/> DEMO ACADÉMICA</span>
      <button className="header-info" onClick={() => navigate('acerca')} aria-label="Acerca del proyecto"><Icon name="info" size={19}/></button>
    </header>
    <main id="contenido" className="main-content">
      <div className="page-heading"><div><p className="eyebrow">PROTOTIPO ACADÉMICO · CUSCO, PERÚ</p><h1>{titles[screen]}</h1></div><div className="points-pill"><Icon name="leaf" size={17}/><span><strong>{data.points}</strong> <small>EcoPuntos DEMO</small></span></div></div>
      {loading ? <div className="loading-state" role="status" aria-live="polite"><span className="spinner"/><span>Cargando sección…</span></div> : <div key={screen} className="screen-content">
        {screen === 'inicio' && <><section className="hero"><div className="hero-topline"><span className="hero-icon"><Icon name="leaf" size={19}/></span><span>UNA IDEA PARA CUSCO</span></div><h2>Pequeñas acciones,<br/><em>un futuro más limpio.</em></h2><p>Explora una propuesta académica para imaginar una experiencia de reciclaje urbano.</p><button className="button button-primary" onClick={() => navigate('ecopuntos')}>Explorar ecopuntos <Icon name="arrow" size={17}/></button><div className="hero-decoration" aria-hidden="true"><span>✳</span><Icon name="leaf" size={49}/></div></section><div className="disclaimer"><Icon name="info" size={19}/><p><strong>Prototipo académico.</strong> La información y las funciones son de demostración; no representan servicios reales.</p></div><section className="section-block"><SectionTitle eyebrow="EMPIEZA POR AQUÍ" title="Explora la experiencia"/><div className="quick-grid"><QuickCard icon="pin" title="Puntos ilustrativos" text="Lugares ficticios y materiales de ejemplo." action="Ver puntos DEMO" onClick={() => navigate('ecopuntos')}/><QuickCard icon="scan" title="Simula un registro" text="Sin cámara, permisos ni datos personales." action="Probar simulación" onClick={() => navigate('escanear')}/><QuickCard icon="gift" title="Recompensas ficticias" text="Ideas de muestra que no se pueden canjear." action="Ver recompensas" onClick={() => navigate('recompensas')}/></div></section><button className="inline-link" onClick={() => navigate('privacidad')}>Privacidad, términos y soporte <Icon name="arrow" size={16}/></button></>}
        {screen === 'ecopuntos' && <section className="section-block"><p className="eyebrow">LUGARES ILUSTRATIVOS</p><h2 className="section-heading">Puntos de ejemplo en Cusco</h2><p className="body-copy">Puntos ficticios y no verificados. No planifiques una visita ni un recojo con estos datos.</p><div className="schematic" role="img" aria-label="Esquema ilustrativo, no geográfico, de puntos de demostración"><span className="schematic-title">CUSCO <small>ESQUEMA DEMO · NO ES UN MAPA</small></span><i className="street street-one"/><i className="street street-two"/><i className="street street-three"/><b className="map-dot dot-one">1</b><b className="map-dot dot-two">2</b><b className="map-dot dot-three">3</b><span className="schematic-note">Ubicaciones no verificadas</span></div><div className="filter-heading"><h3>Filtrar por material</h3><span>{filteredPoints.length} puntos DEMO</span></div><div className="filter-chips" aria-label="Filtrar puntos por material">{(['Todos', ...categories] as const).map(item => <button key={item} className={filter === item ? 'filter-chip selected' : 'filter-chip'} aria-pressed={filter === item} onClick={() => selectFilter(item)}>{item}</button>)}</div><div className="location-list">{filteredPoints.length ? filteredPoints.map(point => <article className="location-card" key={point.name}><span className="location-icon"><Icon name="pin" size={19}/></span><div className="location-info"><div className="location-title"><h3>{point.name}</h3><span className="tiny-tag">{point.status}</span></div><p>{point.area}</p><div className="material-list">{point.materials.map(material => <span key={material}>{material}</span>)}</div><small className="hours-note">Horario: no informado · DEMO</small></div></article>) : <EmptyState title="No hay puntos para este material" text="Prueba otro filtro para ver puntos ilustrativos."/>}</div></section>}
        {screen === 'escanear' && <section className="scan-card"><div className="scan-graphic" aria-hidden="true"><div className="scan-frame"><span/><span/><span/><span/><div className="scan-code">{Array.from({ length: 9 }, (_, i) => <i key={i}/>)}</div><div className="scan-line"/></div></div><p className="eyebrow">SIMULACIÓN · SIN CÁMARA</p><h2>Una acción que suma</h2><p className="body-copy">Pulsa para simular un registro de reciclaje. No se escanea un código ni se registra una entrega real.</p><button className="button button-primary button-wide" onClick={addDemo}><Icon name="scan" size={18}/> Simular registro · +150 EcoPuntos</button><p className="small-note">Registro ficticio, solo en este dispositivo. No se solicitan permisos ni datos personales.</p></section>}
        {screen === 'recompensas' && <section className="section-block"><div className="balance-banner"><div><span className="eyebrow">TU SALDO DE DEMOSTRACIÓN</span><strong>{data.points} <small>EcoPuntos DEMO</small></strong></div><Icon name="leaf" size={24}/></div><p className="eyebrow reward-eyebrow">IDEAS ILUSTRATIVAS · FICTICIAS</p><h2 className="section-heading">Recompensas de muestra</h2><p className="body-copy">Costos y beneficios inventados solo para la interfaz.</p><div className="reward-list"><RewardCard icon="gift" title="Vale DEMO de S/ 10" cost={500} balance={data.points}/><RewardCard icon="leaf" title="Kit verde DEMO" cost={800} balance={data.points}/><RewardCard icon="check" title="Reconocimiento DEMO" cost={1000} balance={data.points}/></div><div className="notice-card"><Icon name="info" size={18}/><p><strong>No canjeable; solo demostración.</strong> No es válido en comercios reales y no existen transacciones o aliados comerciales.</p></div></section>}
        {screen === 'perfil' && <section className="section-block"><div className="profile-card"><span className="avatar"><Icon name="user" size={27}/></span><div><span className="eyebrow">PERFIL FICTICIO</span><h2>Explorador/a DEMO</h2><p>Nivel 1 · Medallas ilustrativas</p></div></div><div className="stats-row"><Stat label="Saldo DEMO" value={String(data.points)} detail="EcoPuntos ficticios"/><Stat label="Registros" value={String(data.history.length)} detail="No son entregas reales"/></div><section className="history-card"><SectionTitle eyebrow="SOLO ESTE DISPOSITIVO" title="Historial ficticio"/>{data.history.length ? <ul className="history-list">{data.history.map(entry => <li key={entry.id}><span className="history-icon"><Icon name="leaf" size={17}/></span><div><strong>{entry.label}</strong><small>{entry.date} · DEMO</small></div><b>+{entry.points} <small>pts</small></b></li>)}</ul> : <EmptyState title="Aún no hay registros" text="Simula una acción para agregar un movimiento ficticio." action={<button className="inline-link" onClick={() => navigate('escanear')}>Ir a Escanear <Icon name="arrow" size={15}/></button>}/>}</section><div className="delete-card"><div><strong>Borrar datos de demostración</strong><p>Elimina el saldo y el historial local ficticio.</p></div><button className="button button-danger" onClick={clearDemo}><Icon name="trash" size={16}/> Borrar datos</button></div><p className="small-note privacy-reminder">Los datos de prueba se guardan solo en el almacenamiento local de este navegador.</p></section>}
        {screen === 'acerca' && <section className="section-block"><div className="about-hero"><span className="version-chip">Prototipo académico 0.1</span><p className="eyebrow">UNA PROPUESTA ACADÉMICA</p><h2>Una experiencia para imaginar hábitos sostenibles.</h2><p>EcoPuntos Urbano explora una posible experiencia digital de reciclaje para Cusco. No es un servicio en operación ni cuenta con aprobación institucional.</p></div><SectionTitle eyebrow="EL CONCEPTO · DEMO" title="Tres pasos de ejemplo"/><div className="steps-grid"><Step number="01" title="Encuentra" text="Explora un punto ilustrativo. Las ubicaciones son ficticias y no verificadas."/><Step number="02" title="Simula" text="Prueba el registro de reciclaje simulado. No registra una entrega real."/><Step number="03" title="Consulta" text="Revisa tus puntos ficticios y el historial de demostración."/></div><SectionTitle eyebrow="CIFRAS ILUSTRATIVAS" title="Métricas de ejemplo"/><div className="metrics-grid"><Metric value="3" label="puntos ilustrativos"/><Metric value="4" label="materiales de ejemplo"/><Metric value="150" label="EcoPuntos por simulación"/></div><p className="metrics-disclaimer"><Icon name="info" size={17}/>Datos de ejemplo, no verificados; no representan el impacto real del proyecto.</p><SectionTitle eyebrow="SIN AFILIACIONES REALES" title="Aliados de demostración"/><div className="partners-grid">{[1, 2, 3].map(item => <article className="partner-card" key={item}><span className="partner-mark"><Icon name="leaf" size={18}/></span><strong>Aliado de demostración</strong><small>Tarjeta ficticia · sin alianza real</small></article>)}</div><div className="credit-box"><Icon name="info" size={20}/><p><strong>Prototipo académico para el Programa de Sostenibilidad Urbana</strong><span>Crédito académico; no implica aprobación o respaldo institucional.</span></p></div></section>}
        {screen === 'privacidad' && <section className="section-block legal-layout"><div className="about-hero legal-hero"><p className="eyebrow">INFORMACIÓN CLARA</p><h2>Privacidad, términos y soporte</h2><p>Prototipo sin cuentas, backend ni contacto oficial habilitado.</p></div><LegalCard title="Qué datos guarda" text="Solo se guarda localmente el saldo ficticio de EcoPuntos y el historial de registros de demostración. La fecha y hora se generan en el dispositivo. No pedimos nombre, correo, cámara ni ubicación."/><LegalCard title="Sin envíos externos" text="La aplicación no envía datos a servidores externos. La interfaz usa recursos locales del proyecto y no depende de mapas, servicios con claves ni tipografías remotas."/><LegalCard title="Cómo borrar datos" text="En Perfil, pulsa “Borrar datos” y confirma para borrar el saldo y el historial DEMO de este navegador. También puedes borrar los datos del sitio desde los ajustes del navegador."/><LegalCard title="Términos de demostración" text="Puntos, materiales, métricas, horarios, recompensas e historial son ficticios o no verificados. No representan servicios, recojos, beneficios ni transacciones reales."/><LegalCard title="Soporte" text="El contacto oficial está pendiente. Este prototipo no tiene correo, teléfono ni canal de soporte habilitado."/><LegalCard title="Publicación" text="Este prototipo no está listo ni aprobado para Google Play. Antes de publicar, deben revisarse privacidad, seguridad, permisos, identidad gráfica y requisitos vigentes de la tienda."/></section>}
      </div>}
    </main>
    <footer className="site-footer"><span>EcoPuntos Urbano · Prototipo académico DEMO</span><button onClick={() => navigate('privacidad')}>Privacidad y soporte</button></footer>
    <nav className="mobile-nav" aria-label="Navegación principal">{navItems.map(item => <button key={item.id} className={screen === item.id ? 'mobile-link active' : 'mobile-link'} onClick={() => navigate(item.id)} aria-current={screen === item.id ? 'page' : undefined}><Icon name={item.icon} size={20}/><span>{item.label}</span></button>)}</nav>
    {toast && <div className="toast" role="status" aria-live="polite"><span className="toast-check"><Icon name="check" size={16}/></span><span>{toast}</span><button onClick={() => setToast('')} aria-label="Cerrar aviso">×</button></div>}
  </div>
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) { return <div className="section-title"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div> }
function QuickCard({ icon, title, text, action, onClick }: { icon: string; title: string; text: string; action: string; onClick: () => void }) { return <article className="quick-card"><span className="quick-icon"><Icon name={icon}/></span><h3>{title}</h3><p>{text}</p><button className="text-button" onClick={onClick}>{action}<Icon name="arrow" size={15}/></button></article> }
function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) { return <div className="empty-state"><span className="empty-icon"><Icon name="leaf" size={21}/></span><h3>{title}</h3><p>{text}</p>{action}</div> }
function RewardCard({ icon, title, cost, balance }: { icon: string; title: string; cost: number; balance: number }) { return <article className="reward-card"><span className="reward-icon"><Icon name={icon} size={22}/></span><div className="reward-details"><h3>{title}</h3><p>{cost.toLocaleString('es-PE')} EcoPuntos DEMO · Saldo: {balance} DEMO</p><small>No válido en comercios reales</small></div><button className="button button-disabled" disabled aria-label={`${title}: canje desactivado, solo demostración`}>No canjeable</button></article> }
function Stat({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="stat-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div> }
function Step({ number, title, text }: { number: string; title: string; text: string }) { return <article className="step-card"><span>{number}</span><h3>{title}</h3><p>{text}</p></article> }
function Metric({ value, label }: { value: string; label: string }) { return <div className="metric-card"><strong>{value}</strong><span>{label}</span></div> }
function LegalCard({ title, text }: { title: string; text: string }) { return <article className="legal-card"><span className="legal-icon"><Icon name="info" size={17}/></span><div><h3>{title}</h3><p>{text}</p></div></article> }

export default App
