// Screen-space units keep the sandbox legible; the force laws still determine motion.
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
export const normalize = (text) => text.replaceAll('−', '-').replace(/\s/g, '').replaceAll('^2', '²').replaceAll('^3', '³').replaceAll('1/2', '½')

export const EQUATIONS = [
  { id: 'newton', text: 'F=ma', recipe: 'Fma', kind: 'newton' },
  { id: 'weight', text: 'F=mg', recipe: 'Fmg', kind: 'weight' },
  { id: 'gravity', text: 'F=GMm/r²', recipe: 'FGMmr', kind: 'gravity', aliases: ['F=GMm/R²'], recipes: ['FGMmR', 'FGMmrr', 'FGMmRR'] },
  { id: 'spring', text: 'F=−kx', recipe: 'Fkx', kind: 'spring' },
  { id: 'dampedSpring', text: 'F=−kx−cv', recipe: 'Fkxcv', kind: 'spring' },
  { id: 'springEnergy', text: '½ke²', recipe: '½ke', kind: 'springEnergy', recipes: ['½kE'] },
  { id: 'electric', text: 'F=qE', recipe: 'FqE', kind: 'electric' },
  { id: 'friction', text: 'F=−μmg', recipe: 'Fμmg', kind: 'friction' },
  { id: 'drag', text: 'F=−cv', recipe: 'Fcv', kind: 'drag' },
  { id: 'quadraticDrag', text: 'F=−cv²', recipe: 'Fcvv', kind: 'quadraticDrag' },
  { id: 'magnetic', text: 'F=qvB', recipe: 'FqvB', kind: 'magnetic' },
  { id: 'centripetal', text: 'F=mv²/r', recipe: 'Fmvr', kind: 'centripetal', recipes: ['Fmvvr'] },
  { id: 'angularCentripetal', text: 'F=mω²r', recipe: 'Fmωr', kind: 'centripetal', recipes: ['Fmωωr'] },
  { id: 'pendulum', text: 'F=−mgθ', recipe: 'Fmgθ', kind: 'pendulum' },
  { id: 'nonlinearSpring', text: 'F=−kx³', recipe: 'Fkxxx', kind: 'spring' },
  { id: 'momentum', text: 'p=mv', recipe: 'pmv', kind: 'momentum' },
  { id: 'kineticEnergy', text: 'E=½mv²', recipe: 'E½mv', kind: 'kineticEnergy', recipes: ['E½mvv'] },
  { id: 'work', text: 'W=Fd', recipe: 'WFd', kind: 'work' },
  { id: 'power', text: 'P=Fv', recipe: 'PFv', kind: 'power' },
  { id: 'wave', text: 'v=fλ', recipe: 'vfλ', kind: 'wave' },
  { id: 'coulomb', text: 'F=kQq/r²', recipe: 'FkQqr', kind: 'coulomb', aliases: ['F=kQq/R²'], recipes: ['FkQqR', 'FkQqrr', 'FkQqRR'] },
  // Recognized relations retained from the original sandbox, without invented forces.
  { id: 'ohm', text: 'V=IR', recipe: 'VIR', kind: 'law' },
  { id: 'electricPower', text: 'P=VI', recipe: 'PVI', kind: 'law' },
  { id: 'heat', text: 'Q=mcT', recipe: 'QmcT', kind: 'law', aliases: ['Q=mcΔT'] },
  { id: 'photon', text: 'E=hf', recipe: 'Ehf', kind: 'law' },
]

const signature = (text) => [...normalize(text).replace(/[=+\-/]/g, '')].sort().join('')
const snippets = new Set(['mg', 'GMm', 'kx', 'cv', 'qE', 'IR', 'VI', 'mcT', 'hf'])
export function resolveFormula(raw) {
  const value = normalize(raw)
  // An explicitly entered equation must match a supported law, not just contain its letters.
  let equation = EQUATIONS.find((law) => [law.text, ...(law.aliases ?? [])].some((text) => normalize(text) === value))
  if (!equation && !value.includes('=')) {
    equation = EQUATIONS.find((law) => [law.recipe, ...(law.recipes ?? [])].some((recipe) => {
      if (signature(recipe) === signature(value)) return true
      return law.text.includes('²') && !recipe.includes('²') && signature(recipe + '²') === signature(value)
    }))
  }
  if (equation) return { text: equation.text, kind: equation.kind, law: equation.id }
  return { text: raw, kind: [...value].length <= 1 || snippets.has(value) ? 'letter' : 'invalid', law: null }
}

export const isField = (item) => ['gravity', 'coulomb'].includes(item.kind)
export const isSpringSource = (item) => ['spring', 'springEnergy'].includes(item.kind)
export const isDynamic = (item) => !['letter', 'invalid', 'law', 'gravity', 'coulomb', 'springEnergy'].includes(item.kind)
export const isDirectional = (item) => ['newton', 'weight', 'electric', 'momentum', 'kineticEnergy', 'work', 'power', 'wave'].includes(item.kind)
export const isMass = (item) => item.kind === 'letter' && item.text === 'm'
export const isCharged = (item) => (isDynamic(item) || item.kind === 'letter') && item.text.includes('q')

export function defaultDirection(kind) {
  return kind === 'weight' ? { x: 0, y: 1 } : kind === 'newton' ? { x: -1, y: 0 } : { x: 1, y: 0 }
}

export function resetMotion(item, viewport = { width: 1200, height: 800 }) {
  const direction = defaultDirection(item.kind)
  const magnitude = item.magnitude ?? 100
  const scale = Math.min(viewport.width / 1200, viewport.height / 800, 1)
  const radius = Math.max(45, 110 * scale)
  let vx = 0, vy = 0
  if (['friction', 'drag', 'quadraticDrag', 'magnetic'].includes(item.kind)) vx = 180
  if (item.kind === 'spring') vx = 130
  if (item.kind === 'momentum' || item.kind === 'wave') vx = magnitude * 1.6
  if (item.kind === 'kineticEnergy') vx = Math.sqrt(200 * magnitude)
  if (item.kind === 'power') vx = 40
  const motion = {
    vx, vy, ax: 0, ay: 0, age: 0, trail: [],
    directionX: direction.x, directionY: direction.y,
    anchorX: item.x, anchorY: item.y, radius,
    fieldScale: item.fieldScale ?? 1, magnitude,
    wavePhase: 0, travelled: 0,
  }
  if (item.kind === 'centripetal') {
    motion.anchorX = item.x - radius
    motion.vy = 150
  }
  if (item.kind === 'pendulum') {
    motion.radius = radius * 1.4
    motion.theta = .45
    motion.omega = 0
    motion.anchorX = item.x - Math.sin(motion.theta) * motion.radius
    motion.anchorY = item.y - Math.cos(motion.theta) * motion.radius
  }
  return motion
}

export function fieldAcceleration(item, fields) {
  return fields.reduce((sum, field) => {
    if (field.id === item.id || (field.kind === 'coulomb' && !isCharged(item))) return sum
    const dx = field.x - item.x, dy = field.y - item.y
    const distance = Math.max(Math.hypot(dx, dy), 90)
    // Coulomb: like charges repel. Gravity: masses attract. Neither has a hard range cutoff.
    const sign = field.kind === 'coulomb' ? -1 : 1
    const strength = sign * 12_000_000 * (field.fieldScale ?? 1) / distance ** 2
    return { ax: sum.ax + dx / distance * strength, ay: sum.ay + dy / distance * strength }
  }, { ax: 0, ay: 0 })
}

export function springAcceleration(item, spring) {
  const dx = spring.x - item.x, dy = spring.y - item.y
  const distance = Math.max(Math.hypot(dx, dy), 1)
  const extension = distance - (item.springRestLength ?? 100)
  const k = 7 * (spring.magnitude ?? 100) / 100
  const strength = spring.law === 'nonlinearSpring' ? k * extension ** 3 / 10000 : k * extension
  const damping = spring.law === 'dampedSpring' ? 1.6 : .08
  return { ax: dx / distance * strength - item.vx * damping, ay: dy / distance * strength - item.vy * damping }
}

// Pure integrator, shared by the app and physical-invariant tests.
export function stepItem(item, dt, fields = [], spring = null) {
  const next = { ...item, age: item.age + dt }
  if (!isDynamic(item) && !isMass(item) && !isCharged(item)) return next
  let remaining = dt
  while (remaining > 1e-8) {
    const h = Math.min(remaining, 1 / 120)
    remaining -= h
    let ax = 0, ay = isMass(next) ? 620 : 0
    const magnitude = next.magnitude ?? 100
    if (['newton', 'weight', 'electric', 'work'].includes(next.kind)) {
      const strength = next.kind === 'work' && next.travelled > 160 ? 0 : magnitude
      ax = next.directionX * strength
      ay = next.directionY * strength
    }
    if (next.kind === 'power') {
      const speed = Math.max(Math.hypot(next.vx, next.vy), 30)
      ax = next.directionX * (magnitude * 100 / speed)
      ay = next.directionY * (magnitude * 100 / speed)
    }
    if (next.kind === 'spring') {
      const dx = next.anchorX - next.x, dy = next.anchorY - next.y
      const k = magnitude / 20
      const damping = next.law === 'dampedSpring' ? 1.6 : .02
      ax = next.law === 'nonlinearSpring' ? k * dx ** 3 / 10000 : k * dx
      ay = next.law === 'nonlinearSpring' ? k * dy ** 3 / 10000 : k * dy
      ax -= next.vx * damping
      ay -= next.vy * damping
    }
    const external = next.kind === 'wave' ? { ax: 0, ay: 0 } : fieldAcceleration(next, fields)
    ax += external.ax
    ay += external.ay
    if (spring) {
      const elastic = springAcceleration(next, spring)
      ax += elastic.ax
      ay += elastic.ay
    }
    if (next.kind === 'pendulum') {
      const length = next.radius
      const tangentX = Math.cos(next.theta), tangentY = -Math.sin(next.theta)
      const angularAcceleration = -(magnitude * 4 / length) * next.theta + (external.ax * tangentX + external.ay * tangentY) / length
      next.omega += angularAcceleration * h
      next.theta += next.omega * h
      next.x = next.anchorX + Math.sin(next.theta) * length
      next.y = next.anchorY + Math.cos(next.theta) * length
      next.vx = Math.cos(next.theta) * length * next.omega
      next.vy = -Math.sin(next.theta) * length * next.omega
      next.ax = tangentX * angularAcceleration * length
      next.ay = tangentY * angularAcceleration * length
      continue
    }
    if (next.kind === 'centripetal') {
      // Radial constraint supplies the centripetal force; external fields act tangentially.
      const dx = next.x - next.anchorX, dy = next.y - next.anchorY
      const distance = Math.max(Math.hypot(dx, dy), 1)
      const angle = Math.atan2(dy, dx)
      const tangentX = -dy / distance, tangentY = dx / distance
      const tangentialSpeed = next.vx * tangentX + next.vy * tangentY + (external.ax * tangentX + external.ay * tangentY) * h
      const newAngle = angle + tangentialSpeed / next.radius * h
      next.x = next.anchorX + Math.cos(newAngle) * next.radius
      next.y = next.anchorY + Math.sin(newAngle) * next.radius
      next.vx = -Math.sin(newAngle) * tangentialSpeed
      next.vy = Math.cos(newAngle) * tangentialSpeed
      const inward = tangentialSpeed ** 2 / next.radius
      next.ax = -Math.cos(newAngle) * inward
      next.ay = -Math.sin(newAngle) * inward
      continue
    }
    if (next.kind === 'magnetic') {
      // Exact velocity rotation: a magnetic force bends velocity without doing work.
      const angle = magnitude / 100 * h
      const vx = next.vx * Math.cos(angle) - next.vy * Math.sin(angle)
      const vy = next.vx * Math.sin(angle) + next.vy * Math.cos(angle)
      ax += -next.vy * magnitude / 100
      ay += next.vx * magnitude / 100
      next.vx = vx + external.ax * h
      next.vy = vy + external.ay * h
    } else {
      next.vx += ax * h
      next.vy += ay * h
    }
    const speed = Math.hypot(next.vx, next.vy)
    if (['friction', 'drag', 'quadraticDrag'].includes(next.kind) && speed > 0) {
      const newSpeed = next.kind === 'friction' ? Math.max(0, speed - magnitude * h)
        : next.kind === 'drag' ? speed * Math.exp(-magnitude / 90 * h)
        : speed / (1 + magnitude / 10000 * speed * h)
      const ratio = newSpeed / speed
      ax += (ratio - 1) * next.vx / h
      ay += (ratio - 1) * next.vy / h
      next.vx *= ratio
      next.vy *= ratio
    }
    if (next.kind === 'wave') next.wavePhase += speed / 110 * Math.PI * 2 * h
    next.ax = ax
    next.ay = ay
    const distance = Math.hypot(next.vx, next.vy) * h
    next.travelled += distance
    next.x += next.vx * h
    next.y += next.vy * h
  }
  return next
}

export function changeArrow(item, directionX, directionY, magnitude) {
  const next = { ...item, directionX, directionY, magnitude }
  const speed = Math.max(Math.hypot(item.vx, item.vy), 100)
  if (item.kind === 'momentum' || item.kind === 'wave' || item.kind === 'kineticEnergy') {
    const newSpeed = item.kind === 'kineticEnergy' ? Math.sqrt(200 * magnitude) : magnitude * 1.6
    next.vx = directionX * newSpeed
    next.vy = directionY * newSpeed
  } else if (item.kind === 'magnetic') {
    next.vx = directionY * speed
    next.vy = -directionX * speed
  } else if (['drag', 'quadraticDrag', 'friction'].includes(item.kind)) {
    next.vx = -directionX * speed
    next.vy = -directionY * speed
  } else if (item.kind === 'centripetal') {
    next.anchorX = item.x + directionX * item.radius
    next.anchorY = item.y + directionY * item.radius
    next.vx = directionY * Math.sqrt(magnitude * item.radius)
    next.vy = -directionX * Math.sqrt(magnitude * item.radius)
  } else if (item.kind === 'spring') {
    next.anchorX = item.x + directionX * 60
    next.anchorY = item.y + directionY * 60
  } else if (item.kind === 'pendulum') {
    // The restoring-force direction follows the pendulum constraint; dragging sets g.
    next.magnitude = magnitude
  }
  return next
}
