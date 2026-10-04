import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Trash } from '@phosphor-icons/react'
import './styles.css'

const SYMBOLS = ['m', 'M', 'g', 'a', 'F', 'v', 'x', 't', 'W', 'P', 'p', 'E', 'e', 'k', 'L', 'd', 'r', 'U', 'R', 'I', 'q', 'B', 'G', 'c', 'f', 'μ', 'ρ', 'ω', 'λ', 'θ', 'Q', 'T', '½', 'h', 'n', 'C', 'S']
const FONT = 76
const MIN_MAGNITUDE = 28
const MAX_MAGNITUDE = 360
const GRAVITY_STRENGTH = 12_000_000
const MIN_FIELD_SCALE = .45
const MAX_FIELD_SCALE = 3

const clamp = (number, min, max) => Math.max(min, Math.min(max, number))
const normalize = (text) => text.replaceAll('−', '-').replace(/\s/g, '')
const responsiveFont = () => clamp(Math.min(window.innerWidth * .1, window.innerHeight * .2), 56, 110)
const glyphUnits = (text) => [...text].reduce((sum, glyph) => sum + (/[mMwW]/.test(glyph) ? .76 : /[=+−]/.test(glyph) ? .63 : /[Ii1]/.test(glyph) ? .33 : .5), 0)
const glyphWidth = (text, fontSize = FONT) => glyphUnits(text) * fontSize

function kindFor(text) {
  const value = normalize(text).replace(/^1\/2/, '½')
  if (/^F=GMm\/[rR](²|\^2)$/.test(value)) return 'gravity'
  if (value === 'F=ma') return 'newton'
  if (value === 'F=-kx' || value === 'F=-kx-cv') return 'spring'
  if (value === '½ke' || value === '½ke²' || value === '½ke^2') return 'springEnergy'
  if (value === 'F=mg') return 'weight'
  if (value === 'F=qE') return 'electric'
  if (value === 'V=IR' || value === 'P=VI' || value === 'Q=mcT' || value === 'E=hf') return 'law'
  if (value.length <= 1 || ['mg', 'GMm', 'kx', 'cv', 'qE', 'IR', 'VI', 'mcT', 'hf'].includes(value)) return 'letter'
  return 'invalid'
}

function canonicalFormula(text) {
  const value = normalize(text)
  const compactValue = value.replace(/[=−-]/g, '')
  if (value === 'Fma' || (value.includes('F') && value.includes('m') && value.includes('a') && value.length <= 3)) return 'F=ma'
  if (value === 'Fmg' || (value.includes('F') && value.includes('m') && value.includes('g') && value.length <= 3)) return 'F=mg'
  if (compactValue.includes('F') && compactValue.includes('k') && compactValue.includes('x') && compactValue.includes('c') && compactValue.includes('v') && compactValue.length <= 5) return 'F=-kx-cv'
  if (value === 'Fkx' || (value.includes('F') && value.includes('k') && value.includes('x') && value.length <= 3)) return 'F=−kx'
  if (value === 'FqE' || (value.includes('F') && value.includes('q') && value.includes('E') && value.length <= 3)) return 'F=qE'
  if ((value === 'FGMmr' || value === 'FGMmR') || (value.includes('F') && value.includes('G') && value.includes('M') && value.includes('m') && (value.includes('r') || value.includes('R')))) return 'F=GMm/r²'
  if (value.length === 3 && value.includes('½') && value.includes('k') && (value.includes('e') || value.includes('E'))) return '½ke²'
  return text
}

const isSpringSource = (item) => item.kind === 'spring' || item.kind === 'springEnergy'

function springAcceleration(item, spring) {
  const dx = spring.x - item.x
  const dy = spring.y - item.y
  const distance = Math.max(Math.hypot(dx, dy), 1)
  const restLength = item.springRestLength ?? 100
  const extension = distance - restLength
  const strength = extension * 7
  return {
    ax: dx / distance * strength - item.vx * .18,
    ay: dy / distance * strength - item.vy * .18,
  }
}

function forceDirection(item) {
  if (item.kind === 'weight') return { x: 0, y: 1 }
  if (item.kind === 'electric') return { x: 1, y: 0 }
  if (item.kind === 'newton') return { x: -1, y: 0 }
  return { x: -1, y: 0 }
}

function directionalKind(kind) {
  return ['newton', 'weight', 'electric'].includes(kind)
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
  const fallback = forceDirection(item)
  const hasForcedDirection = directionalKind(item.kind) && Number.isFinite(item.directionX) && Number.isFinite(item.directionY)
  const directionX = hasForcedDirection ? item.directionX : speed > 5 ? item.vx / speed : fallback.x
  const directionY = hasForcedDirection ? item.directionY : speed > 5 ? item.vy / speed : fallback.y
  const edge = Math.abs(directionX) * item.width / 2 + Math.abs(directionY) * item.height / 2 + 18
  const startX = item.x + directionX * edge
  const startY = item.y + directionY * edge
  return {
    directionX,
    directionY,
    edge,
    startX,
    startY,
    endX: startX + directionX * (item.magnitude ?? 100),
    endY: startY + directionY * (item.magnitude ?? 100),
  }
}

function fieldBoundaryDistance(item, x, y) {
  const scale = item.fieldScale ?? 1
  const radiusX = item.width * 1.59 * scale
  const radiusY = item.height * .64 * scale
  const normalizedRadius = Math.hypot((x - item.x) / radiusX, (y - (item.y - 4)) / radiusY)
  return Math.abs(normalizedRadius - 1) * Math.min(radiusX, radiusY)
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const lengthSquared = dx * dx + dy * dy
  if (!lengthSquared) return Math.hypot(px - x1, py - y1)
  const t = clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1)
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

function gravityAcceleration(item, fields) {
  return fields.reduce((total, field) => {
    const dx = field.x - item.x
    const dy = field.y - item.y
    const distance = Math.max(Math.hypot(dx, dy), 90)
    const strength = GRAVITY_STRENGTH * (field.fieldScale ?? 1) / (distance * distance)
    return {
      ax: total.ax + dx / distance * strength,
      ay: total.ay + dy / distance * strength,
    }
  }, { ax: 0, ay: 0 })
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

function displayFormula(formula) {
  if (formula.kind === 'springEnergy') return <span className="energy-formula"><span>½</span><span>k</span><span>e<sup>2</sup></span></span>
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
    const kind = kindFor(text)
    const direction = forceDirection({ kind })
    const item = { id, text, x, y, vx: 0, vy: 0, held: false, kind, age: 0, trail: [], fontSize, width: metrics.width, height: metrics.height, magnitude: 100, fieldScale: 1, directionX: direction.x, directionY: direction.y, anchorX: x, anchorY: y }
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
        const gravityFields = current.filter((other) => other.kind === 'gravity')
        const next = current.map((item) => {
          if (item.held) return item
          const attachedMass = current.some((other) => other.attachedTo === item.id)
          if (isSpringSource(item) && attachedMass) return { ...item, vx: 0, vy: 0 }
          const updated = { ...item, age: item.age + dt, trail: item.trail.filter((point) => now - point.time < 700) }
          const isM = item.kind === 'letter' && normalize(item.text) === 'm'
          const attachedSpring = item.attachedTo ? current.find((other) => other.id === item.attachedTo && isSpringSource(other)) : null
          const isDynamicFormula = ['newton', 'weight', 'electric', 'spring'].includes(item.kind)
          let ax = 0
          let ay = isM ? 620 : 0
          if (item.kind === 'newton') {
            const strength = item.magnitude ?? 120
            ax = item.directionX * strength
            ay = item.directionY * strength
          } else if (item.kind === 'weight') {
            const strength = item.magnitude ?? 120
            ax = item.directionX * strength
            ay = item.directionY * strength
          } else if (item.kind === 'electric') {
            const strength = item.magnitude ?? 120
            ax = item.directionX * strength
            ay = item.directionY * strength
          } else if (item.kind === 'spring') {
            ax = -(item.x - item.anchorX) * 5.5 - item.vx * .02
            ay = -(item.y - item.anchorY) * 4 - item.vy * .04
          }
          if (attachedSpring) {
            const springForce = springAcceleration(item, attachedSpring)
            ax += springForce.ax
            ay += springForce.ay
          }
          if (gravityFields.length && (isM || isDynamicFormula)) {
            const fieldForce = gravityAcceleration(item, gravityFields)
            ax += fieldForce.ax
            ay += fieldForce.ay
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
        if (item.kind === 'gravity') {
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
        const magnitude = Math.hypot(item.vx, item.vy)
        if (magnitude < 5 && !directionalKind(item.kind)) return
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
        const dx = event.clientX - item.x
        const dy = event.clientY - item.y
        const distance = Math.max(Math.hypot(dx, dy), 1)
        return { ...item, magnitude: clamp(distance - active.edge, MIN_MAGNITUDE, MAX_MAGNITUDE), directionX: dx / distance, directionY: dy / distance, vx: 0, vy: 0 }
      }))
      return
    }
    if (active.type === 'field') {
      setItems((current) => current.map((item) => {
        if (item.id !== active.id) return item
        const dx = event.clientX - item.x
        const dy = event.clientY - (item.y - 4)
        const normalizedRadius = Math.hypot(dx / (item.width * 1.59), dy / (item.height * .64))
        return { ...item, fieldScale: clamp(normalizedRadius, MIN_FIELD_SCALE, MAX_FIELD_SCALE) }
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
    const fieldHit = [...itemsRef.current].reverse().find((item) => item.kind === 'gravity' && fieldBoundaryDistance(item, event.clientX, event.clientY) < 18)
    if (fieldHit) {
      event.preventDefault()
      drag.current = { type: 'field', id: fieldHit.id, pointerId: event.pointerId }
      if (event.currentTarget.setPointerCapture) event.currentTarget.setPointerCapture(event.pointerId)
      return
    }
    const hit = [...itemsRef.current].reverse().find((item) => {
      if (['letter', 'law', 'invalid', 'gravity', 'springEnergy'].includes(item.kind) || item.held) return false
      if (!directionalKind(item.kind) && Math.hypot(item.vx, item.vy) < 5) return false
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
    {items.map((item) => <div key={item.id} className={`formula ${item.held ? 'held' : ''} ${item.kind === 'invalid' ? 'invalid' : ''}`} style={{ left: item.x, top: item.y, fontSize: item.fontSize }} data-direction-x={item.directionX} data-direction-y={item.directionY} data-field-scale={item.kind === 'gravity' ? item.fieldScale : undefined} onPointerDown={(event) => start(event, null, item.id)} onContextMenu={(event) => removeFormula(event, item.id)}><span className={item.kind === 'gravity' ? 'gravity-formula' : ''}>{displayFormula(item)}</span></div>)}
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
  const text = canonicalFormula(first.text + second.text)
  const kind = kindFor(text)
  const metrics = formulaMetrics(text, first.fontSize)
  const direction = forceDirection({ kind })
  const merged = { ...first, x: (first.x + second.x) / 2, y: (first.y + second.y) / 2, text, kind, held: false, ...metrics, vx: 0, vy: 0, fieldScale: kind === 'gravity' ? (first.fieldScale ?? 1) : first.fieldScale, directionX: direction.x, directionY: direction.y, anchorX: (first.x + second.x) / 2, anchorY: (first.y + second.y) / 2 }
  return items.filter((item) => item.id !== current.id && item.id !== target.id).concat(merged)
}

createRoot(document.getElementById('root')).render(<App />)
