import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Trash } from '@phosphor-icons/react'
import './styles.css'

const SYMBOLS = ['m', 'M', 'g', 'a', 'F', 'v', 'x', 't', 'W', 'P', 'p', 'E', 'k', 'L', 'd', 'r', 'U', 'R', 'I', 'q', 'B', 'G', 'c', 'f', 'μ', 'ρ', 'ω', 'λ', 'θ', 'Q', 'T', '½', 'h', 'n', 'C', 'S']
const FONT = 76
const MIN_MAGNITUDE = 28
const MAX_MAGNITUDE = 360

const clamp = (number, min, max) => Math.max(min, Math.min(max, number))
const normalize = (text) => text.replaceAll('−', '-').replace(/\s/g, '')
const responsiveFont = () => clamp(Math.min(window.innerWidth * .1, window.innerHeight * .2), 56, 110)
const glyphUnits = (text) => [...text].reduce((sum, glyph) => sum + (/[mMwW]/.test(glyph) ? .76 : /[=+−]/.test(glyph) ? .63 : /[Ii1]/.test(glyph) ? .33 : .5), 0)
const glyphWidth = (text, fontSize = FONT) => glyphUnits(text) * fontSize

function kindFor(text) {
  const value = normalize(text)
  if (/^F=GMm\/[rR](²|\^2)$/.test(value)) return 'gravity'
  if (value === 'F=ma') return 'newton'
  if (value === 'F=-kx' || value === 'F=-kx-cv') return 'spring'
  if (value === 'F=mg' || value === 'F=qE' || value === 'V=IR' || value === 'P=VI' || value === 'Q=mcT' || value === 'E=hf') return 'law'
  if (value.length <= 1 || ['mg', 'GMm', 'kx', 'cv', 'qE', 'IR', 'VI', 'mcT', 'hf'].includes(value)) return 'letter'
  return 'invalid'
}

function formulaMetrics(text, fontSize) {
  const value = normalize(text)
  if (/^F=GMm\/[rR](²|\^2)$/.test(value)) {
    const fractionWidth = Math.max(glyphUnits('GMm') + .3, glyphUnits('r') + .42)
    return { width: (glyphUnits('F=') + fractionWidth + .1) * fontSize, height: fontSize * 1.24 }
  }
  return { width: glyphWidth(text, fontSize), height: fontSize }
}

function arrowGeometry(item) {
  const speed = Math.hypot(item.vx, item.vy)
  const directionX = speed > 5 ? item.vx / speed : -1
  const directionY = speed > 5 ? item.vy / speed : 0
  const edge = item.width / 2 + 18
  const startX = item.x + directionX * edge
  const startY = item.y + directionY * Math.min(item.height * .16, 16)
  return {
    directionX,
    directionY,
    startX,
    startY,
    endX: item.x + directionX * (edge + (item.magnitude ?? 100)),
    endY: item.y + directionY * (Math.min(item.height * .16, 16) + (item.magnitude ?? 100) * .12),
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy
  if (!lengthSquared) return Math.hypot(px - x1, py - y1)
  const t = clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1)
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

function displayFormula(formula) {
  if (formula.kind !== 'gravity') return formula.text
  const denominator = formula.text.includes('/R') ? 'R' : 'r'
  return <span className="gravity-formula"><span>F=</span><Fraction numerator="GMm" denominator={denominator} exponent="2" /></span>
}

function Fraction({ numerator, denominator, exponent }) {
  return <span className="fraction" role="img" aria-label={`${numerator} over ${denominator} squared`}>
    <span className="fraction-part fraction-numerator">{numerator}</span>
    <span className="fraction-rule" aria-hidden="true" />
    <span className="fraction-part fraction-denominator">{denominator}<sup>{exponent}</sup></span>
  </span>
}

function App() {
  const [items, setItems] = useState([])
  const canvas = useRef(null)
  const palette = useRef(null)
  const trash = useRef(null)
  const nextId = useRef(1)
  const drag = useRef(null)
  const itemsRef = useRef([])
  itemsRef.current = items

  const add = (text, x, y, fresh = true) => {
    const id = nextId.current++
    const fontSize = responsiveFont()
    const metrics = formulaMetrics(text, fontSize)
    const item = { id, text, x, y, vx: 0, vy: 0, held: false, kind: kindFor(text), age: 0, trail: [], fontSize, width: metrics.width, height: metrics.height, magnitude: 100, anchorX: x, anchorY: y }
    setItems((current) => [...current, item])
    return id
  }

  const remove = (id) => setItems((current) => current.filter((item) => item.id !== id))

  useEffect(() => {
    let frame
    let last = performance.now()
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.04)
      last = now
      setItems((current) => {
        const width = window.innerWidth
        const height = window.innerHeight
        const floor = height * .83
        const next = current.map((item) => {
          if (item.held) return item
          const updated = { ...item, age: item.age + dt, trail: item.trail.filter((point) => now - point.time < 700) }
          const isM = item.kind === 'letter' && normalize(item.text) === 'm'
          const isGravity = current.some((other) => other.kind === 'gravity') && isM
          let ax = 0
          let ay = isM ? 620 : 0
          if (item.kind === 'newton') {
            ax = -120
            ay = 0
          } else if (item.kind === 'spring') {
            ax = -(item.x - item.anchorX) * 5.5 - item.vx * .02
            ay = -(item.y - item.anchorY) * 4 - item.vy * .04
          } else if (isGravity) {
            const field = current.find((other) => other.kind === 'gravity')
            const dx = field.x - item.x
            const dy = field.y - item.y
            const distance = Math.max(Math.hypot(dx, dy), 145)
            ax = dx / distance * 210000 / (distance * distance)
            ay = dy / distance * 210000 / (distance * distance)
          }
          updated.vx = clamp(updated.vx + ax * dt, -420, 420)
          updated.vy = clamp(updated.vy + ay * dt, -420, 420)
          updated.x += updated.vx * dt
          updated.y += updated.vy * dt
          const half = updated.width / 2
          if (updated.x < half || updated.x > width - half - 15) {
            updated.x = clamp(updated.x, half, width - half - 15)
            updated.vx *= -.48
          }
          if (updated.y - updated.height * .45 < 0) {
            updated.y = updated.height * .45
            updated.vy = Math.abs(updated.vy) * .45
          }
          if (updated.y + updated.height * .18 > floor) {
            updated.y = floor - updated.height * .18
            updated.vy = Math.abs(updated.vy) > 50 ? -updated.vy * .2 : 0
            updated.vx *= Math.exp(-5 * dt)
          }
          if (!['letter', 'law', 'invalid', 'gravity'].includes(updated.kind) && Math.hypot(updated.vx, updated.vy) > 8 && (!updated.trail.length || now - updated.trail.at(-1).time > 32)) {
            updated.trail.push({ x: updated.x, y: updated.y, time: now })
          }
          return updated
        })
        return next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const resize = () => {
      const fontSize = responsiveFont()
      setItems((current) => current.map((item) => ({ ...item, fontSize, ...formulaMetrics(item.text, fontSize) })))
    }
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const context = canvas.current?.getContext('2d')
    if (!context) return undefined
    const draw = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = window.innerWidth
      const height = window.innerHeight
      if (canvas.current.width !== width * ratio || canvas.current.height !== height * ratio) {
        canvas.current.width = width * ratio
        canvas.current.height = height * ratio
        context.setTransform(ratio, 0, 0, ratio, 0, 0)
      }
      context.clearRect(0, 0, width, height)
      itemsRef.current.forEach((item) => {
        if (['letter', 'law', 'invalid', 'gravity'].includes(item.kind) || item.held) {
          if (item.kind !== 'gravity') return
        }
        item.trail.forEach((point, index) => {
          const opacity = Math.max(0, .18 * (index + 1) / item.trail.length)
          context.fillStyle = `rgba(75, 71, 64, ${opacity})`
          context.beginPath()
          context.arc(point.x, point.y, 1.7 + index % 2, 0, Math.PI * 2)
          context.fill()
        })
        if (item.kind === 'gravity') {
          for (let ring = 0; ring < 3; ring += 1) {
            context.strokeStyle = `rgba(87, 80, 70, ${.16 - ring * .035})`
            context.lineWidth = 1
            context.beginPath()
            context.ellipse(item.x, item.y - 4, item.width * (.95 + ring * .32), item.height * (.38 + ring * .13), -.12, 0, Math.PI * 2)
            context.stroke()
          }
          return
        }
        const magnitude = Math.hypot(item.vx, item.vy)
        if (magnitude < 5) return
        const arrow = arrowGeometry(item)
        const { directionX, directionY, startX, startY, endX, endY } = arrow
        context.strokeStyle = 'rgba(69, 65, 59, .6)'
        context.fillStyle = 'rgba(69, 65, 59, .64)'
        context.lineWidth = 1.1
        context.beginPath(); context.moveTo(startX, startY); context.lineTo(endX, endY); context.stroke()
        context.beginPath(); context.moveTo(endX, endY); context.lineTo(endX - directionX * 11 - directionY * 5, endY - directionY * 11 + directionX * 5); context.lineTo(endX - directionX * 11 + directionY * 5, endY - directionY * 11 - directionX * 5); context.closePath(); context.fill()
        context.font = 'italic 19px Times New Roman'
        context.fillText('F', endX + directionX * 7 - 6, endY + directionY * 7 - 9)
      })
      requestAnimationFrame(draw)
    }
    const frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  const move = (event) => {
    const active = drag.current
    if (!active || event.pointerId !== active.pointerId) return
    if (active.type === 'arrow') {
      setItems((current) => current.map((item) => {
        if (item.id !== active.id) return item
        const projection = (event.clientX - item.x) * active.directionX + (event.clientY - item.y) * active.directionY
        return { ...item, magnitude: clamp(projection - item.width / 2 - 18, MIN_MAGNITUDE, MAX_MAGNITUDE) }
      }))
      return
    }
    setItems((current) => current.map((item) => item.id === active.id ? { ...item, x: event.clientX + active.dx, y: event.clientY + active.dy, vx: 0, vy: 0 } : item))
  }

  const release = (event, cancelled = false) => {
    const active = drag.current
    if (!active || event.pointerId !== active.pointerId) return
    drag.current = null
    if (active.type === 'arrow') return
    const bin = trash.current.getBoundingClientRect()
    if (cancelled || (event.clientX > bin.left - 20 && event.clientX < bin.right + 20 && event.clientY > bin.top - 20 && event.clientY < bin.bottom + 20)) {
      remove(active.id)
      return
    }
    setItems((current) => mergeNear(current, active.id))
  }

  const start = (event, text, id = null) => {
    if (event.button !== 0 || drag.current) return
    event.preventDefault()
    event.stopPropagation()
    const current = items.find((item) => item.id === id)
    const itemId = id ?? add(text, event.clientX, event.clientY)
    const item = current || { x: event.clientX, y: event.clientY }
    drag.current = { id: itemId, pointerId: event.pointerId, dx: (item.x || event.clientX) - event.clientX, dy: (item.y || event.clientY) - event.clientY }
    if (event.currentTarget.setPointerCapture) event.currentTarget.setPointerCapture(event.pointerId)
    setItems((list) => list.map((body) => body.id === itemId ? { ...body, held: true } : body))
  }

  const beginCanvas = (event) => {
    if (event.button !== 0 || drag.current) return
    const hit = [...itemsRef.current].reverse().find((item) => {
      if (['letter', 'law', 'invalid', 'gravity'].includes(item.kind) || item.held || Math.hypot(item.vx, item.vy) < 5) return false
      const arrow = arrowGeometry(item)
      return distanceToSegment(event.clientX, event.clientY, arrow.startX, arrow.startY, arrow.endX, arrow.endY) < 16
    })
    if (!hit) return
    event.preventDefault()
    const arrow = arrowGeometry(hit)
    drag.current = { type: 'arrow', id: hit.id, pointerId: event.pointerId, directionX: arrow.directionX, directionY: arrow.directionY }
    if (event.currentTarget.setPointerCapture) event.currentTarget.setPointerCapture(event.pointerId)
  }

  const removeFormula = (event, id) => {
    event.preventDefault()
    event.stopPropagation()
    remove(id)
  }

  const clickPalette = (event, symbol) => {
    if (event.detail === 0) add(symbol, window.innerWidth * .42, 100)
  }

  return <main className="sandbox" onPointerDown={beginCanvas} onPointerMove={move} onPointerUp={release} onPointerCancel={(event) => release(event, true)}>
    <canvas ref={canvas} className="effects" aria-hidden="true" />
    <div className="floor" aria-hidden="true" />
    {items.map((item) => <div key={item.id} className={`formula ${item.held ? 'held' : ''} ${item.kind === 'invalid' ? 'invalid' : ''}`} style={{ left: item.x, top: item.y, fontSize: item.fontSize }} onPointerDown={(event) => start(event, null, item.id)} onContextMenu={(event) => removeFormula(event, item.id)}><span className={item.kind === 'gravity' ? 'gravity-formula' : ''}>{displayFormula(item)}</span></div>)}
    <aside className="palette" ref={palette}>{SYMBOLS.map((symbol) => <button key={symbol} type="button" className="symbol" onPointerDown={(event) => start(event, symbol)} onClick={(event) => clickPalette(event, symbol)}>{symbol}</button>)}</aside>
    <button className="trash" ref={trash} type="button" aria-label="删除符号" onClick={() => setItems([])}><Trash size={40} weight="light" /></button>
  </main>
}

function mergeNear(items, id) {
  const current = items.find((item) => item.id === id)
  if (!current) return items
  const target = items.find((other) => other.id !== id && Math.abs(other.x - current.x) < (other.width + current.width) / 2 + 28 && Math.abs(other.y - current.y) < 50)
  if (!target) return items.map((item) => item.id === id ? { ...item, held: false } : item)
  const first = current.x < target.x ? current : target
  const second = first === current ? target : current
  let text = first.text + second.text
  if (normalize(text) === 'Fma') text = 'F=ma'
  if (normalize(text) === 'Fmg') text = 'F=mg'
  if (normalize(text) === 'Fkx') text = 'F=−kx'
  if (normalize(text) === 'FqE') text = 'F=qE'
  if (normalize(text) === 'FGMmr' || normalize(text) === 'FGMmR') text = 'F=GMm/r²'
  const kind = kindFor(text)
  const metrics = formulaMetrics(text, first.fontSize)
  const merged = { ...first, x: (first.x + second.x) / 2, y: (first.y + second.y) / 2, text, kind, held: false, ...metrics, vx: 0, vy: 0, anchorX: (first.x + second.x) / 2, anchorY: (first.y + second.y) / 2 }
  return items.filter((item) => item.id !== current.id && item.id !== target.id).concat(merged)
}

createRoot(document.getElementById('root')).render(<App />)
