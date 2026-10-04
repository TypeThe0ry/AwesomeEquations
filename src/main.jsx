import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Trash } from '@phosphor-icons/react'
import './styles.css'
import { clamp, normalize, resolveFormula, defaultDirection, resetMotion, isField, isDynamic, isDirectional, isSpringSource, stepItem, changeArrow } from './physics.js'

const SYMBOLS = ['m', 'M', 'g', 'a', 'F', 'v', 'x', 't', 'W', 'P', 'p', 'E', 'e', 'k', 'L', 'd', 'r', 'U', 'R', 'I', 'q', 'B', 'G', 'c', 'f', 'μ', 'ρ', 'ω', 'λ', 'θ', 'Q', 'T', '½', 'h', 'n', 'C', 'S', 'V']
const FONT = 76
const MIN_MAGNITUDE = 28
const MAX_MAGNITUDE = 360
const MIN_FIELD_SCALE = .45
const MAX_FIELD_SCALE = 3

const responsiveFont = () => clamp(Math.min(window.innerWidth * .1, window.innerHeight * .2), 56, 110)
const glyphUnits = (text) => [...text].reduce((sum, glyph) => sum + (/[mMwW]/.test(glyph) ? .76 : /[=+−]/.test(glyph) ? .63 : /[Ii1]/.test(glyph) ? .33 : .5), 0)
const glyphWidth = (text, fontSize = FONT) => glyphUnits(text) * fontSize

function formulaMetrics(text, fontSize) {
  const slash = text.indexOf('/')
  if (slash >= 0) {
    const equals = text.indexOf('=')
    const prefix = equals >= 0 ? text.slice(0, equals + 1) : ''
    const numerator = text.slice(prefix.length, slash)
    const denominator = text.slice(slash + 1)
    return { width: (glyphUnits(prefix) + Math.max(glyphUnits(numerator), glyphUnits(denominator)) * .88 + .42) * fontSize, height: fontSize * 1.6 }
  }
  return { width: glyphWidth(text, fontSize), height: fontSize }
}

function fittedMetrics(text) {
  let fontSize = responsiveFont()
  const available = Math.max(180, window.innerWidth * .73)
  const width = formulaMetrics(text, fontSize).width
  if (width > available) fontSize *= available / width
  return { fontSize, ...formulaMetrics(text, fontSize) }
}

function arrowGeometry(item) {
  const force = Math.hypot(item.ax ?? 0, item.ay ?? 0)
  const fallback = defaultDirection(item.kind)
  const directionX = isDirectional(item) ? item.directionX : force > 1 ? item.ax / force : fallback.x
  const directionY = isDirectional(item) ? item.directionY : force > 1 ? item.ay / force : fallback.y
  const edge = Math.abs(directionX) * item.width / 2 + Math.abs(directionY) * item.height / 2 + 18
  const startX = item.x + directionX * edge
  const startY = item.y + directionY * edge
  return { directionX, directionY, edge, startX, startY,
    endX: startX + directionX * item.magnitude, endY: startY + directionY * item.magnitude }
}

function fieldScaleAt(item, x, y) {
  // Match the rotated ellipse actually drawn on the canvas.
  const dx = x - item.x, dy = y - (item.y - 4)
  const localX = dx * Math.cos(.12) - dy * Math.sin(.12)
  const localY = dx * Math.sin(.12) + dy * Math.cos(.12)
  return Math.hypot(localX / (item.width * 1.59), localY / (item.height * .64))
}

function fieldBoundaryDistance(item, x, y) {
  return Math.abs(fieldScaleAt(item, x, y) - item.fieldScale) * Math.min(item.width * 1.59, item.height * .64)
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy
  if (!lengthSquared) return Math.hypot(px - x1, py - y1)
  const t = clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1)
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

function drawSpring(context, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.max(Math.hypot(dx, dy), 1)
  const directionX = dx / length
  const directionY = dy / length
  const normalX = -directionY
  const normalY = directionX
  const lead = Math.min(18, length * .16)
  const coilLength = Math.max(length - lead * 2, 8)
  const turns = Math.max(6, Math.min(18, Math.round(coilLength / 14)))
  const amplitude = Math.min(15, Math.max(7, coilLength * .08))
  context.save()
  context.strokeStyle = 'rgba(76, 71, 64, .82)'
  context.lineWidth = 1.7
  context.beginPath()
  context.moveTo(x1, y1)
  context.lineTo(x1 + directionX * lead, y1 + directionY * lead)
  for (let step = 0; step <= turns * 10; step += 1) {
    const progress = step / (turns * 10)
    const along = lead + coilLength * progress
    const wave = Math.sin(progress * turns * Math.PI * 2) * amplitude
    context.lineTo(x1 + directionX * along + normalX * wave, y1 + directionY * along + normalY * wave)
  }
  context.lineTo(x2, y2)
  context.stroke()
  context.restore()
}

function springAnchorPoint(source, mass) {
  const dx = mass.x - source.x
  const dy = mass.y - source.y
  const distance = Math.max(Math.hypot(dx, dy), 1)
  return {
    x: source.x + dx / distance * (source.width / 2 + 10),
    y: source.y + dy / distance * Math.min(source.height * .16, 16),
  }
}

function attachToSpring(items, id) {
  const mass = items.find((item) => item.id === id)
  if (!mass || mass.kind !== 'letter' || normalize(mass.text) !== 'm') return null
  const spring = items
    .filter((item) => item.id !== id && isSpringSource(item))
    .sort((a, b) => Math.hypot(a.x - mass.x, a.y - mass.y) - Math.hypot(b.x - mass.x, b.y - mass.y))[0]
  if (!spring || Math.hypot(spring.x - mass.x, spring.y - mass.y) > 220) return null
  const restLength = Math.max(Math.hypot(spring.x - mass.x, spring.y - mass.y), 80)
  return items.map((item) => {
    if (item.id === id) return { ...item, attachedTo: spring.id, springRestLength: restLength, held: false, vx: 0, vy: 0 }
    if (item.id === spring.id && item.kind === 'spring') return { ...item, vx: 0, vy: 0 }
    return item
  })
}

function MathText({ text }) {
  return text.split(/([²³])/).map((part, index) => /[²³]/.test(part)
    ? <sup key={index}>{part === '²' ? '2' : '3'}</sup> : <span key={index}>{part}</span>)
}

function displayFormula(formula) {
  const slash = formula.text.indexOf('/')
  if (slash < 0) return <MathText text={formula.text} />
  const equals = formula.text.indexOf('=')
  const prefix = equals >= 0 ? formula.text.slice(0, equals + 1) : ''
  return <span className="fraction-equation"><MathText text={prefix} /><Fraction numerator={formula.text.slice(prefix.length, slash)} denominator={formula.text.slice(slash + 1)} /></span>
}

function Fraction({ numerator, denominator }) {
  return <span className="fraction" role="img" aria-label={`${numerator} / ${denominator}`}>
    <span className="fraction-part fraction-numerator"><MathText text={numerator} /></span>
    <span className="fraction-rule" aria-hidden="true" />
    <span className="fraction-part fraction-denominator"><MathText text={denominator} /></span>
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

  const add = (text, x, y) => {
    const id = nextId.current++
    const formula = resolveFormula(text)
    const item = { id, parts: text, ...formula, x, y, held: false, magnitude: 100, ...fittedMetrics(formula.text) }
    Object.assign(item, resetMotion(item, { width: window.innerWidth, height: window.innerHeight }))
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
        const fields = current.filter(isField)
        const next = current.map((item) => {
          if (item.held || (drag.current?.type === 'arrow' && drag.current.id === item.id)) return item
          const attachedMass = current.some((other) => other.attachedTo === item.id)
          if (isSpringSource(item) && attachedMass) return { ...item, vx: 0, vy: 0 }
          const spring = current.find((other) => other.id === item.attachedTo && isSpringSource(other))
          const updated = stepItem(item, dt, fields, spring)
          updated.trail = item.trail.filter((point) => now - point.time < (item.kind === 'wave' ? 1800 : 700))
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
          if (isDynamic(updated) && Math.hypot(updated.vx, updated.vy) > 8 && (!updated.trail.length || now - updated.trail.at(-1).time > 32)) {
            const amplitude = updated.kind === 'wave' ? Math.sin(updated.wavePhase) * 22 : 0
            updated.trail.push({ x: updated.x - updated.directionY * amplitude, y: updated.y + updated.directionX * amplitude, time: now })
          }
          return updated
        })
        return next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const resize = () => {
      setItems((current) => current.map((item) => ({ ...item, ...fittedMetrics(item.text) })))
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
    let frame
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
        if (item.held) return
        const attachedMass = itemsRef.current.find((candidate) => candidate.attachedTo === item.id)
        if (isSpringSource(item)) {
          const endpoint = attachedMass ?? { x: item.x + item.width / 2 + 150, y: item.y }
          const anchor = springAnchorPoint(item, endpoint)
          drawSpring(context, anchor.x, anchor.y, endpoint.x, endpoint.y)
        }
        if (['letter', 'law', 'invalid', 'springEnergy'].includes(item.kind)) return
        item.trail.forEach((point, index) => {
          const opacity = Math.max(0, .18 * (index + 1) / item.trail.length)
          context.fillStyle = `rgba(75, 71, 64, ${opacity})`
          context.beginPath()
          context.arc(point.x, point.y, 1.7 + index % 2, 0, Math.PI * 2)
          context.fill()
        })
        if (isField(item)) {
          const fieldScale = item.fieldScale ?? 1
          for (let ring = 0; ring < 3; ring += 1) {
            context.strokeStyle = `rgba(87, 80, 70, ${.16 - ring * .035})`
            context.lineWidth = 1
            context.beginPath()
            context.ellipse(item.x, item.y - 4, item.width * (.95 + ring * .32) * fieldScale, item.height * (.38 + ring * .13) * fieldScale, -.12, 0, Math.PI * 2)
            context.stroke()
          }
          return
        }
        if (item.kind === 'pendulum') {
          context.strokeStyle = 'rgba(87, 80, 70, .4)'
          context.beginPath()
          context.moveTo(item.anchorX, item.anchorY)
          context.lineTo(item.x, item.y - item.height / 2 - 6)
          context.stroke()
        }
        if (item.kind === 'centripetal') {
          context.strokeStyle = 'rgba(87, 80, 70, .16)'
          context.beginPath()
          context.arc(item.anchorX, item.anchorY, item.radius, 0, Math.PI * 2)
          context.stroke()
        }
        if (!isDynamic(item)) return
        const arrow = arrowGeometry(item)
        const { directionX, directionY, startX, startY, endX, endY } = arrow
        context.strokeStyle = 'rgba(69, 65, 59, .6)'
        context.fillStyle = 'rgba(69, 65, 59, .64)'
        context.lineWidth = 1.1
        context.beginPath(); context.moveTo(startX, startY); context.lineTo(endX, endY); context.stroke()
        context.beginPath(); context.moveTo(endX, endY); context.lineTo(endX - directionX * 11 - directionY * 5, endY - directionY * 11 + directionX * 5); context.lineTo(endX - directionX * 11 + directionY * 5, endY - directionY * 11 - directionX * 5); context.closePath(); context.fill()
        context.font = 'italic 19px Times New Roman'
        const label = { newton: 'a', momentum: 'p', kineticEnergy: 'E', power: 'P', wave: 'v' }[item.kind] ?? 'F'
        context.fillText(label, endX + directionX * 7 - 6, endY + directionY * 7 - 9)
        const speed = Math.hypot(item.vx, item.vy)
        context.font = 'italic 14px Times New Roman'
        context.fillText(`v = ${(speed / 100).toFixed(2)}`, item.x - item.width / 2, item.y + item.height / 2 + 18)
      })
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [])

  const move = (event) => {
    const active = drag.current
    if (!active || event.pointerId !== active.pointerId) return
    if (active.type === 'arrow') {
      setItems((current) => current.map((item) => {
        if (item.id !== active.id) return item
        const dx = event.clientX - item.x
        const dy = event.clientY - item.y
        const distance = Math.max(Math.hypot(dx, dy), 1)
        const directionX = dx / distance, directionY = dy / distance
        const edge = Math.abs(directionX) * item.width / 2 + Math.abs(directionY) * item.height / 2 + 18
        return changeArrow(item, directionX, directionY, clamp(distance - edge, MIN_MAGNITUDE, MAX_MAGNITUDE))
      }))
      return
    }
    if (active.type === 'field') {
      setItems((current) => current.map((item) => {
        if (item.id !== active.id) return item
        return { ...item, fieldScale: clamp(fieldScaleAt(item, event.clientX, event.clientY), MIN_FIELD_SCALE, MAX_FIELD_SCALE) }
      }))
      return
    }
    setItems((current) => current.map((item) => item.id === active.id ? { ...item, x: event.clientX + active.dx, y: event.clientY + active.dy, vx: 0, vy: 0 } : item))
  }

  const release = (event, cancelled = false) => {
    const active = drag.current
    if (!active || event.pointerId !== active.pointerId) return
    drag.current = null
    if (active.type === 'arrow' || active.type === 'field') return
    const bin = trash.current.getBoundingClientRect()
    if (cancelled || (event.clientX > bin.left - 20 && event.clientX < bin.right + 20 && event.clientY > bin.top - 20 && event.clientY < bin.bottom + 20)) {
      remove(active.id)
      return
    }
    setItems((current) => attachToSpring(current, active.id) ?? mergeNear(current, active.id))
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
    setItems((list) => list.map((body) => body.id === itemId ? { ...body, held: true, attachedTo: undefined, springRestLength: undefined } : body))
  }

  const beginCanvas = (event) => {
    if (event.button !== 0 || drag.current) return
    const fieldHit = [...itemsRef.current].reverse().find((item) => isField(item) && fieldBoundaryDistance(item, event.clientX, event.clientY) < 18)
    if (fieldHit) {
      event.preventDefault()
      drag.current = { type: 'field', id: fieldHit.id, pointerId: event.pointerId }
      if (event.currentTarget.setPointerCapture) event.currentTarget.setPointerCapture(event.pointerId)
      return
    }
    const hit = [...itemsRef.current].reverse().find((item) => {
      if (!isDynamic(item) || item.held) return false
      const arrow = arrowGeometry(item)
      return distanceToSegment(event.clientX, event.clientY, arrow.startX, arrow.startY, arrow.endX, arrow.endY) < 16
    })
    if (!hit) return
    event.preventDefault()
    const arrow = arrowGeometry(hit)
    drag.current = { type: 'arrow', id: hit.id, pointerId: event.pointerId, directionX: arrow.directionX, directionY: arrow.directionY, edge: arrow.edge }
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
    {items.map((item) => <div key={item.id} className={`formula ${item.held ? 'held' : ''} ${item.kind === 'invalid' ? 'invalid' : ''}`} style={{ left: item.x, top: item.y, fontSize: item.fontSize }} data-equation={item.text} data-kind={item.kind} data-magnitude={item.magnitude} data-speed={Math.hypot(item.vx, item.vy).toFixed(3)} data-direction-x={item.directionX} data-direction-y={item.directionY} data-field-scale={isField(item) ? item.fieldScale : undefined} onPointerDown={(event) => start(event, null, item.id)} onContextMenu={(event) => removeFormula(event, item.id)}><span className="formula-math">{displayFormula(item)}</span></div>)}
    <aside className="palette" ref={palette}>{SYMBOLS.map((symbol) => <button key={symbol} type="button" className="symbol" onPointerDown={(event) => start(event, symbol)} onClick={(event) => clickPalette(event, symbol)}>{symbol}</button>)}</aside>
    <button className="trash" ref={trash} type="button" aria-label="删除符号" onClick={() => setItems([])}><Trash size={40} weight="light" /></button>
  </main>
}

function mergeNear(items, id) {
  const current = items.find((item) => item.id === id)
  if (!current) return items
  const target = items.find((other) => other.id !== id && Math.abs(other.x - current.x) < (other.width + current.width) / 2 + 28 && Math.abs(other.y - current.y) < 50)
  if (!target) return items.map((item) => item.id === id
    ? { ...item, ...resetMotion(item, { width: window.innerWidth, height: window.innerHeight }), held: false } : item)
  const first = current.x < target.x ? current : target
  const second = first === current ? target : current
  const parts = (first.parts ?? first.text) + (second.parts ?? second.text)
  const formula = resolveFormula(parts)
  const merged = { ...first, ...formula, parts, x: (first.x + second.x) / 2, y: (first.y + second.y) / 2, held: false,
    attachedTo: undefined, springRestLength: undefined, ...fittedMetrics(formula.text) }
  Object.assign(merged, resetMotion(merged, { width: window.innerWidth, height: window.innerHeight }))
  return items.filter((item) => item.id !== current.id && item.id !== target.id).concat(merged)
}

createRoot(document.getElementById('root')).render(<App />)
