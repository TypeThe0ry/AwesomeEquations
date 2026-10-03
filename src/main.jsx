import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Trash } from '@phosphor-icons/react'
import './styles.css'

const DOMAINS = {
  mechanics: {
    label: 'Mechanics',
    short: '力学',
    accent: '#b87342',
    description: '运动、力与场',
    symbols: ['m', 'M', 'g', 'a', 'F', 'v', 'x', 't', 'W', 'P', 'p', 'E', 'k', 'L', 'd', 'r', 'U', 'R', 'I', 'q', 'G', 'c', 'f', 'μ', 'ρ', 'ω', 'λ', 'θ', 'Q', 'T', '½', 'h', 'n', 'C', 'S'],
  },
  electromagnetism: {
    label: 'Fields',
    short: '电磁',
    accent: '#4b7f82',
    description: '电荷、电路与场',
    symbols: ['q', 'E', 'B', 'F', 'I', 'V', 'R', 'C', 'L', 'Φ', 'μ', 'ε', 'ρ', 'J', 't', 'r', 'd', 'v', 'c', 'Ω', 'λ', 'P', 'W', 'U', 'Q', 'Δ', '=', '+', '−', '²', '∫'],
  },
  thermo: {
    label: 'Thermo',
    short: '热力',
    accent: '#aa6949',
    description: '能量、熵与状态',
    symbols: ['Q', 'T', 'S', 'U', 'n', 'C', 'V', 'P', 'R', 'k', 'Δ', 'E', 'W', 'N', 'p', 'm', 'c', 'T₁', 'T₂', '=', '+', '−', '²', '∂', 'd', 't', 'h', 'λ', 'ρ', 'γ'],
  },
  quantum: {
    label: 'Quantum',
    short: '量子',
    accent: '#78629b',
    description: '波函数与测不准',
    symbols: ['ψ', 'ħ', 'E', 'p', 'λ', 'x', 't', 'm', 'c', 'f', 'k', 'θ', 'Δ', 'σ', 'Ω', 'n', '=', '+', '−', '²', '∂', '∫', 'i', '∞', 'h', 'ν', 'φ', 'P', 'S'],
  },
}

const PRESETS = [
  { id: 'gravity', label: 'Gravity', formula: 'F = GMm / r²', domain: 'mechanics', hint: '吸引质量 m，形成轨道或坠落' },
  { id: 'spring', label: 'Spring', formula: 'F = −kx', domain: 'mechanics', hint: '改变 k，观察简谐振动' },
  { id: 'circuit', label: 'Ohm', formula: 'V = IR', domain: 'electromagnetism', hint: '把电势差转为电流' },
  { id: 'heat', label: 'Heat', formula: 'Q = mcΔT', domain: 'thermo', hint: '让能量改变温度' },
  { id: 'wave', label: 'Wave', formula: 'E = hf', domain: 'quantum', hint: '把频率映射成能量' },
]

const INITIAL_TOKENS = [
  { id: 1, value: 'F', x: 62, y: 76 },
  { id: 2, value: '=', x: 67, y: 76 },
  { id: 3, value: 'm', x: 72, y: 76 },
  { id: 4, value: 'a', x: 77, y: 76 },
  { id: 5, value: 'F', x: 62, y: 134 },
  { id: 6, value: '=', x: 67, y: 134 },
  { id: 7, value: 'm', x: 72, y: 134 },
  { id: 8, value: 'g', x: 77, y: 134 },
]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function normalizeFormula(values) {
  return values.join('').replace(/\s/g, '').replace(/−/g, '-')
}

function equationLabel(values) {
  return values.join(' ')
}

function parseLaws(tokens) {
  const rows = new Map()
  tokens.forEach((token) => {
    const row = Math.round(token.y / 58)
    if (!rows.has(row)) rows.set(row, [])
    rows.get(row).push(token)
  })
  return [...rows.values()]
    .map((row) => row.sort((a, b) => a.x - b.x))
    .map((row) => ({ values: row.map((token) => token.value), tokens: row }))
    .filter((row) => row.values.length > 1)
}

function describeLaw(values) {
  const formula = normalizeFormula(values)
  if (formula === 'F=ma') return { label: 'Newton II', status: 'active', tone: 'orange', text: '力被解释为质量与加速度的乘积' }
  if (formula === 'F=mg') return { label: 'Gravity', status: 'active', tone: 'orange', text: '重力正在作用于物体' }
  if (formula === 'F=-kx' || formula === 'F=-kx^3') return { label: 'Elastic force', status: 'active', tone: 'violet', text: '位置正在生成回复力' }
  if (formula === 'V=IR') return { label: 'Ohm', status: 'ready', tone: 'teal', text: '电势差、电流与电阻已连接' }
  if (formula === 'P=VI') return { label: 'Power', status: 'ready', tone: 'teal', text: '电路功率由当前状态决定' }
  if (formula === 'Q=mcΔT') return { label: 'Heat capacity', status: 'ready', tone: 'red', text: '热量与质量、比热、温差连接' }
  if (formula === 'E=hf') return { label: 'Quantum', status: 'ready', tone: 'violet', text: '频率正在定义量子能量' }
  if (formula === 'λ=h/p') return { label: 'de Broglie', status: 'ready', tone: 'violet', text: '动量被映射为物质波长' }
  if (values.includes('=')) return { label: 'Unresolved law', status: 'draft', tone: 'gray', text: '公式结构已识别，等待更多变量或定义' }
  return { label: 'Symbols', status: 'draft', tone: 'gray', text: '靠近其他符号即可组成公式' }
}

function App() {
  const [domain, setDomain] = useState('mechanics')
  const [tokens, setTokens] = useState(INITIAL_TOKENS)
  const [running, setRunning] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [body, setBody] = useState({ x: 67, y: 40, vx: 0, vy: 0, energy: 0 })
  const [trail, setTrail] = useState([])
  const [dragging, setDragging] = useState(null)
  const canvasRef = useRef(null)
  const tokenId = useRef(100)

  const laws = useMemo(() => parseLaws(tokens), [tokens])
  const lawDescriptions = useMemo(() => laws.map((law) => ({ ...law, ...describeLaw(law.values) })), [laws])
  const activeFormulas = useMemo(() => laws.map((law) => normalizeFormula(law.values)), [laws])
  const palette = DOMAINS[domain]

  useEffect(() => {
    if (!running) return undefined
    const tick = window.setInterval(() => {
      setBody((current) => {
        const hasGravity = activeFormulas.includes('F=mg') || activeFormulas.includes('F=GMm/r^2')
        const hasSpring = activeFormulas.includes('F=-kx') || activeFormulas.includes('F=-kx^3')
        const hasElectric = activeFormulas.includes('F=qE')
        let ax = 0
        let ay = 0
        if (hasGravity) ay += 0.38
        if (hasElectric) ax += 0.12
        if (hasSpring) ax += -((current.x - 50) * 0.012)
        const nextVx = clamp(current.vx + ax, -4.5, 4.5)
        const nextVy = clamp(current.vy + ay, -4.5, 4.5)
        let nextX = current.x + nextVx * 0.34
        let nextY = current.y + nextVy * 0.34
        let bouncedVx = nextVx
        let bouncedVy = nextVy
        if (nextX > 91 || nextX < 9) {
          nextX = clamp(nextX, 9, 91)
          bouncedVx *= -0.72
        }
        if (nextY > 74 || nextY < 17) {
          nextY = clamp(nextY, 17, 74)
          bouncedVy *= -0.66
        }
        return { x: nextX, y: nextY, vx: bouncedVx, vy: bouncedVy, energy: Math.abs(bouncedVx) + Math.abs(bouncedVy) }
      })
      setTrail((current) => {
        const point = { x: body.x, y: body.y }
        return [...current.slice(-19), point]
      })
    }, 40)
    return () => window.clearInterval(tick)
  }, [activeFormulas, body.x, body.y, running])

  const resetSimulation = () => {
    setBody({ x: 67, y: 40, vx: 0, vy: 0, energy: 0 })
    setTrail([])
  }

  const clearCanvas = () => {
    setTokens([])
    setSelectedId(null)
    resetSimulation()
  }

  const addToken = (value, x = 16, y = 18) => {
    const newToken = { id: tokenId.current++, value, x, y }
    setTokens((current) => [...current, newToken])
    setSelectedId(newToken.id)
  }

  const dropToken = (event) => {
    event.preventDefault()
    const value = event.dataTransfer.getData('text/plain')
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!value || !rect) return
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 5, 91)
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 7, 86)
    addToken(value, x, y)
    setDragging(null)
  }

  const moveToken = (event, id) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 4, 91)
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 5, 88)
    setTokens((current) => current.map((token) => token.id === id ? { ...token, x, y } : token))
  }

  const loadPreset = (preset) => {
    const chars = preset.formula.replaceAll(' ', '').split('')
    const presetTokens = chars.map((value, index) => ({ id: tokenId.current++, value, x: 10 + index * 5.7, y: 79 }))
    setTokens((current) => [...current.filter((token) => token.y < 54), ...presetTokens])
    setDomain(preset.domain)
    setRunning(true)
  }

  const handlePointerMove = (event) => {
    if (!dragging) return
    moveToken(event, dragging)
  }

  const handlePointerUp = () => {
    setDragging(null)
  }

  return (
    <main className="app-shell" style={{ '--accent': palette.accent }} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><span></span><span></span><span></span></div>
          <div>
            <div className="eyebrow">EQUATION WORLD <span>● LIVE</span></div>
            <h1>物理规律由你编写</h1>
          </div>
        </div>
        <div className="top-actions">
          <button className="text-button" onClick={() => setShowGuide((value) => !value)}>How it works <span className="tiny-arrow">↗</span></button>
          <button className={`run-button ${running ? 'is-running' : ''}`} onClick={() => setRunning((value) => !value)}><span className="run-dot"></span>{running ? 'Running' : 'Paused'}</button>
        </div>
      </header>

      <section className="workspace">
        <div className="field-label"><span className="status-dot"></span>{palette.label.toUpperCase()} FIELD <span className="field-description">/ {palette.description}</span></div>
        <div className="canvas-wrap">
          <div className="canvas" ref={canvasRef} onDragOver={(event) => event.preventDefault()} onDrop={dropToken} onPointerDown={() => setSelectedId(null)}>
            <div className="crosshair crosshair-one"></div>
            <div className="crosshair crosshair-two"></div>
            <div className="origin-label">0, 0</div>
            <div className="axis axis-x"></div>
            <div className="axis axis-y"></div>

            {trail.map((point, index) => (
              <span key={`${point.x}-${point.y}-${index}`} className="trail-dot" style={{ left: `${point.x}%`, top: `${point.y}%`, opacity: (index + 1) / (trail.length + 2) }}></span>
            ))}
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="mass-center"><span>M</span><i></i></div>
            <div className="force-vector" style={{ left: `${body.x - 7}%`, top: `${body.y + 5}%`, transform: `rotate(${Math.atan2(body.vy + 0.4, body.vx - 0.1) * 180 / Math.PI}deg)` }}><span>F</span></div>
            <div className="sim-body" style={{ left: `${body.x}%`, top: `${body.y}%` }} onPointerDown={(event) => event.stopPropagation()}><span></span></div>
            <div className="body-caption" style={{ left: `${body.x + 2}%`, top: `${body.y - 9}%` }}>m <em>{body.energy.toFixed(2)}</em></div>

            {tokens.map((token) => (
              <div key={token.id} className={`formula-token ${selectedId === token.id ? 'selected' : ''}`} style={{ left: `${token.x}%`, top: `${token.y}%` }} onPointerDown={(event) => { event.stopPropagation(); setSelectedId(token.id); setDragging(token.id) }}>
                {token.value}
              </div>
            ))}

            <div className="drop-hint">DROP SYMBOLS HERE <span>↓</span></div>
            <div className="ground-line"><span>WORLD FLOOR</span></div>
          </div>

          <aside className="symbol-dock">
            <div className="dock-topline"><span>SYMBOLS</span><span className="dock-count">{palette.symbols.length}</span></div>
            <div className="domain-tabs">
              {Object.entries(DOMAINS).map(([key, item]) => <button key={key} className={domain === key ? 'active' : ''} onClick={() => setDomain(key)}>{item.short}</button>)}
            </div>
            <div className="symbol-grid">
              {palette.symbols.map((symbol, index) => (
                <button key={`${symbol}-${index}`} className="symbol-button" draggable onDragStart={(event) => { event.dataTransfer.setData('text/plain', symbol); setDragging('palette') }} onDragEnd={() => setDragging(null)} onClick={() => addToken(symbol)}>{symbol}</button>
              ))}
            </div>
            <div className="dock-footer"><span className="drag-glyph">✣</span> 拖动到画布，公式就会开始运行</div>
          </aside>
        </div>

        <div className="lower-deck">
          <div className="equation-inspector">
            <div className="section-kicker">ACTIVE LAWS <span>{String(laws.length).padStart(2, '0')}</span></div>
            <div className="law-list">
              {lawDescriptions.length === 0 && <div className="empty-law">拖入符号，开始写下第一条规律。</div>}
              {lawDescriptions.map((law, index) => <div className="law-row" key={`${law.label}-${index}`}><div className={`law-index ${law.tone}`}>0{index + 1}</div><div className="law-copy"><strong>{equationLabel(law.values)}</strong><span>{law.text}</span></div><span className={`law-state ${law.status}`}>{law.status}</span></div>)}
            </div>
          </div>
          <div className="control-deck">
            <div className="control-caption">SIMULATION CONTROL</div>
            <div className="control-row"><button className="primary-control" onClick={() => setRunning((value) => !value)}><span>{running ? 'Ⅱ' : '▶'}</span>{running ? 'Pause world' : 'Run world'}</button><button className="secondary-control" onClick={resetSimulation}>Reset state</button><button className="icon-control" onClick={clearCanvas} aria-label="Clear canvas"><Trash size={16} weight="regular" /></button></div>
            <div className="equation-note"><span className="note-line"></span><span>Equation is the executable layer</span><span className="note-dot"></span></div>
          </div>
        </div>
      </section>

      <section className="preset-strip">
        <div className="preset-heading"><span className="section-kicker">TRY A LAW</span><span>从一个可运行的示例开始</span></div>
        <div className="preset-list">{PRESETS.map((preset) => <button key={preset.id} className="preset-card" onClick={() => loadPreset(preset)}><span className="preset-domain">{DOMAINS[preset.domain].short}</span><strong>{preset.formula}</strong><small>{preset.hint}</small><span className="preset-arrow">↗</span></button>)}</div>
      </section>

      {showGuide && <div className="guide-popover"><button className="close-guide" onClick={() => setShowGuide(false)}>×</button><span className="section-kicker">THE ENGINE</span><h2>把公式变成世界的规则。</h2><p>拖动符号、排列成方程。引擎会把每条方程编译成一个可以运行的物理约束，再把结果送回画布。</p><div className="guide-chain"><span>symbol</span><b>→</b><span>equation</span><b>→</b><span>world</span></div></div>}
      <footer className="footer-line"><span>Equation World / prototype 01</span><span>Drag symbols · compose laws · watch reality respond</span></footer>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
