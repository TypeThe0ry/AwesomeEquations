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

// Each relation can be read in more than one direction. The left-hand symbol is
// the output; the remaining symbols become draggable inputs in the canvas.
const MODELS = {
  newton: {
    outputs: { F: ['m', 'a'], a: ['F', 'm'], m: ['F', 'a'] },
    formats: { F: 'F=ma', a: 'a=F/m', m: 'm=F/a' },
    defaults: { F: 100, m: 1, a: 100 },
    rules: { F: p => p.m * p.a, a: p => p.F / Math.max(p.m, .01), m: p => p.F / Math.max(p.a, .01) },
  },
  weight: {
    outputs: { F: ['m', 'g'], g: ['F', 'm'], m: ['F', 'g'] },
    formats: { F: 'F=mg', g: 'g=F/m', m: 'm=F/g' },
    defaults: { F: 100, m: 1, g: 100 },
    rules: { F: p => p.m * p.g, g: p => p.F / Math.max(p.m, .01), m: p => p.F / Math.max(p.g, .01) },
  },
  gravity: {
    outputs: { F: ['G', 'M', 'm', 'r'], a: ['G', 'M', 'r'] },
    formats: { F: 'F=GMm/r²', a: 'a=GM/r²' },
    defaults: { F: 100, G: 100, M: 100, m: 1, r: 10, a: 100 },
    rules: { F: p => p.G * p.M * p.m / Math.max(p.r ** 2, .01), a: p => p.G * p.M / Math.max(p.r ** 2, .01) },
  },
  spring: {
    outputs: { F: ['k', 'x'], x: ['F', 'k'], k: ['F', 'x'] },
    formats: { F: 'F=−kx', x: 'x=−F/k', k: 'k=−F/x' },
    defaults: { F: -100, k: 100, x: 1 },
    rules: { F: p => -p.k * p.x, x: p => -p.F / Math.max(p.k, .01), k: p => -p.F / Math.max(p.x, .01) },
  },
  springEnergy: {
    outputs: { E: ['k', 'e'], k: ['E', 'e'] },
    formats: { E: '½ke²', k: 'k=2E/e²' },
    defaults: { E: 100, k: 100, e: 1 },
    rules: { E: p => .5 * p.k * p.e ** 2, k: p => 2 * p.E / Math.max(p.e ** 2, .01) },
  },
  dampedSpring: {
    outputs: { F: ['k', 'x', 'c', 'v'] },
    formats: { F: 'F=−kx−cv' },
    defaults: { F: -100, k: 100, x: 1, c: 10, v: 0 },
    rules: { F: p => -p.k * p.x - p.c * p.v },
  },
  electric: {
    outputs: { F: ['q', 'E'], q: ['F', 'E'], E: ['F', 'q'] },
    formats: { F: 'F=qE', q: 'q=F/E', E: 'E=F/q' },
    defaults: { F: 100, q: 1, E: 100 },
    rules: { F: p => p.q * p.E, q: p => p.F / Math.max(p.E, .01), E: p => p.F / Math.max(p.q, .01) },
  },
  friction: {
    outputs: { F: ['μ', 'm', 'g'] },
    formats: { F: 'F=−μmg' },
    defaults: { F: -100, μ: 1, m: 1, g: 100 },
    rules: { F: p => -p.μ * p.m * p.g },
  },
  drag: {
    outputs: { F: ['c', 'v'], c: ['F', 'v'], v: ['F', 'c'] },
    formats: { F: 'F=−cv', c: 'c=−F/v', v: 'v=−F/c' },
    defaults: { F: -100, c: 100, v: 1 },
    rules: { F: p => -p.c * p.v, c: p => -p.F / Math.max(p.v, .01), v: p => -p.F / Math.max(p.c, .01) },
  },
  quadraticDrag: {
    outputs: { F: ['c', 'v'] },
    formats: { F: 'F=−cv²' },
    defaults: { F: -100, c: 100, v: 1 },
    rules: { F: p => -p.c * p.v ** 2 },
  },
  magnetic: {
    outputs: { F: ['q', 'v', 'B'] },
    formats: { F: 'F=qvB' },
    defaults: { F: 100, q: 1, v: 1, B: 100 },
    rules: { F: p => p.q * p.v * p.B },
  },
  centripetal: {
    outputs: { F: ['m', 'v', 'r'] },
    formats: { F: 'F=mv²/r' },
    defaults: { F: 100, m: 1, v: 10, r: 10 },
    rules: { F: p => p.m * p.v ** 2 / Math.max(p.r, .01) },
  },
  angularCentripetal: {
    outputs: { F: ['m', 'ω', 'r'] },
    formats: { F: 'F=mω²r' },
    defaults: { F: 100, m: 1, ω: 10, r: 1 },
    rules: { F: p => p.m * p.ω ** 2 * p.r },
  },
  pendulum: {
    outputs: { F: ['m', 'g', 'θ'] },
    formats: { F: 'F=−mgθ' },
    defaults: { F: -45, m: 1, g: 100, θ: .45 },
    rules: { F: p => -p.m * p.g * p.θ },
  },
  nonlinearSpring: {
    outputs: { F: ['k', 'x'] },
    formats: { F: 'F=−kx³' },
    defaults: { F: -100, k: 100, x: 1 },
    rules: { F: p => -p.k * p.x ** 3 },
  },
  momentum: {
    outputs: { p: ['m', 'v'], m: ['p', 'v'], v: ['p', 'm'] },
    formats: { p: 'p=mv', m: 'm=p/v', v: 'v=p/m' },
    defaults: { p: 100, m: 1, v: 100 },
    rules: { p: p => p.m * p.v, m: p => p.p / Math.max(p.v, .01), v: p => p.p / Math.max(p.m, .01) },
  },
  kineticEnergy: {
    outputs: { E: ['m', 'v'], m: ['E', 'v'], v: ['E', 'm'] },
    formats: { E: 'E=½mv²', m: 'm=2E/v²' },
    defaults: { E: 100, m: 1, v: 10 },
    rules: { E: p => .5 * p.m * p.v ** 2, m: p => 2 * p.E / Math.max(p.v ** 2, .01), v: p => Math.sqrt(Math.max(0, 2 * p.E / Math.max(p.m, .01))) },
  },
  work: {
    outputs: { W: ['F', 'd'], F: ['W', 'd'], d: ['W', 'F'] },
    formats: { W: 'W=Fd', F: 'F=W/d', d: 'd=W/F' },
    defaults: { W: 100, F: 100, d: 1 },
    rules: { W: p => p.F * p.d, F: p => p.W / Math.max(p.d, .01), d: p => p.W / Math.max(p.F, .01) },
  },
  power: {
    outputs: { P: ['F', 'v'], F: ['P', 'v'], v: ['P', 'F'] },
    formats: { P: 'P=Fv', F: 'F=P/v', v: 'v=P/F' },
    defaults: { P: 100, F: 100, v: 1 },
    rules: { P: p => p.F * p.v, F: p => p.P / Math.max(p.v, .01), v: p => p.P / Math.max(p.F, .01) },
  },
  wave: {
    outputs: { v: ['f', 'λ'], f: ['v', 'λ'], λ: ['v', 'f'] },
    formats: { v: 'v=fλ', f: 'f=v/λ', λ: 'λ=v/f' },
    defaults: { v: 100, f: 10, λ: 10 },
    rules: { v: p => p.f * p.λ, f: p => p.v / Math.max(p.λ, .01), λ: p => p.v / Math.max(p.f, .01) },
  },
  coulomb: {
    outputs: { F: ['k', 'Q', 'q', 'r'], q: ['F', 'k', 'Q', 'r'] },
    formats: { F: 'F=kQq/r²', q: 'q=Fr²/kQ' },
    defaults: { F: 100, k: 100, Q: 1, q: 1, r: 1 },
    rules: { F: p => p.k * p.Q * p.q / Math.max(p.r ** 2, .01), q: p => p.F * p.r ** 2 / Math.max(p.k * p.Q, .01) },
  },
  ohm: {
    outputs: { V: ['I', 'R'], I: ['V', 'R'], R: ['V', 'I'] },
    formats: { V: 'V=IR', I: 'I=V/R', R: 'R=V/I' },
    defaults: { V: 100, I: 10, R: 10 },
    rules: { V: p => p.I * p.R, I: p => p.V / Math.max(p.R, .01), R: p => p.V / Math.max(p.I, .01) },
  },
  electricPower: {
    outputs: { P: ['V', 'I'], V: ['P', 'I'], I: ['P', 'V'] },
    formats: { P: 'P=VI', V: 'V=P/I', I: 'I=P/V' },
    defaults: { P: 100, V: 10, I: 10 },
    rules: { P: p => p.V * p.I, V: p => p.P / Math.max(p.I, .01), I: p => p.P / Math.max(p.V, .01) },
  },
  heat: {
    outputs: { Q: ['m', 'c', 'T'] },
    formats: { Q: 'Q=mcT' },
    defaults: { Q: 100, m: 1, c: 10, T: 10 },
    rules: { Q: p => p.m * p.c * p.T },
  },
  photon: {
    outputs: { E: ['h', 'f'], h: ['E', 'f'], f: ['E', 'h'] },
    formats: { E: 'E=hf', h: 'h=E/f', f: 'f=E/h' },
    defaults: { E: 100, h: 10, f: 10 },
    rules: { E: p => p.h * p.f, h: p => p.E / Math.max(p.f, .01), f: p => p.E / Math.max(p.h, .01) },
  },
}

const modelFor = (law) => MODELS[law] ?? null

const signature = (text) => [...normalize(text).replace(/[=+\-/]/g, '')].sort().join('')
const snippets = new Set(['mg', 'GMm', 'kx', 'cv', 'qE', 'IR', 'VI', 'mcT', 'hf'])

function outputFromRaw(raw, model, fallback) {
  if (!model) return fallback
  const value = normalize(raw)
  const left = value.includes('=') ? value.slice(0, value.indexOf('=')) : value
  const candidate = [...left].find((symbol) => model.outputs[symbol]) ?? [...value].find((symbol) => model.outputs[symbol])
  return candidate ?? fallback
}

function formulaText(law, output, fallback) {
  return modelFor(law)?.formats?.[output] ?? fallback
}

export function resolveFormula(raw) {
  const value = normalize(raw)
  // An explicitly entered equation must match a supported law, not just contain its letters.
  let equation = EQUATIONS.find((law) => [law.text, ...(law.aliases ?? [])].some((text) => normalize(text) === value))
  if (!equation) {
    equation = EQUATIONS.find((law) => [law.recipe, ...(law.recipes ?? [])].some((recipe) => {
      if (signature(recipe) === signature(value)) return true
      return law.text.includes('²') && !recipe.includes('²') && signature(recipe + '²') === signature(value)
    }))
  }
  if (equation) {
    const model = modelFor(equation.id)
    const fallbackOutput = model ? Object.keys(model.outputs)[0] : null
    const outputSymbol = outputFromRaw(raw, model, fallbackOutput)
    const inputSymbols = model?.outputs?.[outputSymbol] ?? []
    return {
      text: formulaText(equation.id, outputSymbol, equation.text),
      kind: equation.kind,
      law: equation.id,
      outputSymbol,
      inputSymbols,
    }
  }
  return { text: raw, kind: [...value].length <= 1 || snippets.has(value) ? 'letter' : 'invalid', law: null }
}

export function refreshFormula(item) {
  const model = modelFor(item.law)
  if (!model || !item.outputSymbol) return item
  const inputSymbols = model.outputs[item.outputSymbol] ?? item.inputSymbols ?? []
  const values = { ...model.defaults }
  inputSymbols.forEach((symbol) => {
    if (Number.isFinite(item.parameters?.[symbol])) values[symbol] = item.parameters[symbol]
  })
  const outputValue = model.rules[item.outputSymbol]?.(values) ?? values[item.outputSymbol] ?? 0
  values[item.outputSymbol] = outputValue
  const forceValue = Number.isFinite(values.F) ? values.F : item.forceValue ?? outputValue
  const massValue = Math.max(Math.abs(values.m ?? item.massValue ?? 1), .01)
  const accelerationValue = Number.isFinite(values.a) ? values.a : forceValue / massValue
  const speedValue = Number.isFinite(values.v) ? values.v : item.speedValue
  const parameters = Object.fromEntries(inputSymbols.map((symbol) => [symbol, values[symbol]]))
  const arrowValue = ['work', 'power'].includes(item.law) || item.outputSymbol === 'F'
    ? forceValue
    : item.kind === 'newton' && item.outputSymbol !== 'F' ? accelerationValue : outputValue
  return {
    ...item,
    inputSymbols,
    parameters,
    outputValue,
    forceValue,
    massValue,
    accelerationValue,
    speedValue,
    arrowValue,
    // Keep the arrow readable while preserving the exact calculated value below the formula.
    magnitude: clamp(Math.abs(arrowValue) || 28, 28, 360),
  }
}

export const isField = (item) => ['gravity', 'coulomb'].includes(item.kind)
export const isSpringSource = (item) => ['spring', 'springEnergy'].includes(item.kind)
export const isDynamic = (item) => !['letter', 'invalid', 'law', 'gravity', 'coulomb', 'springEnergy'].includes(item.kind)
export const isDirectional = (item) => ['newton', 'weight', 'electric', 'momentum', 'kineticEnergy', 'work', 'power', 'wave'].includes(item.kind)
export const isMass = (item) => item.kind === 'letter' && item.text === 'm'
export const isCharged = (item) => (isDynamic(item) || item.kind === 'letter') && item.text.includes('q')
export const isCollidable = (item) => !item.held && !isField(item) && (isDynamic(item) || isMass(item))

export function collisionRadius(item) {
  const width = item.width ?? 76
  const height = item.height ?? 76
  return clamp(Math.max(width * .24, height * .42), 22, 72)
}

function collisionMass(item) {
  return isMass(item) ? .8 : clamp(Math.sqrt((item.width ?? 76) / 76), .8, 2.2)
}

// Resolves formula-to-formula and formula-to-world impacts after each integration step.
// The visual formulas are treated as soft discs so long equations still have readable contacts.
export function resolveWorldCollisions(items, { width, floor, restitution = .72 } = {}) {
  const next = items.map((item) => ({ ...item }))
  for (const item of next) {
    if (!isCollidable(item)) continue
    const radius = collisionRadius(item)
    const left = item.width / 2
    const right = width - item.width / 2
    const top = item.height * .45
    const bottom = floor - item.height * .18
    if (item.x < left) {
      item.x = left
      if (item.vx < 0) item.vx = -item.vx * restitution
      item.collisionFlash = .18
    } else if (item.x > right) {
      item.x = right
      if (item.vx > 0) item.vx = -item.vx * restitution
      item.collisionFlash = .18
    }
    if (item.y < top) {
      item.y = top
      if (item.vy < 0) item.vy = -item.vy * restitution
      item.collisionFlash = .18
    } else if (item.y > bottom) {
      item.y = bottom
      if (item.vy > 0) item.vy = -item.vy * restitution
      item.vx *= .96
      item.collisionFlash = .18
    }
    item.collisionRadius = radius
  }
  for (let i = 0; i < next.length; i += 1) {
    const a = next[i]
    if (!isCollidable(a)) continue
    const ra = collisionRadius(a)
    for (let j = i + 1; j < next.length; j += 1) {
      const b = next[j]
      if (!isCollidable(b)) continue
      const rb = collisionRadius(b)
      let dx = b.x - a.x
      let dy = b.y - a.y
      let distance = Math.hypot(dx, dy)
      const minimum = ra + rb
      if (distance >= minimum) continue
      if (distance < 1e-6) {
        dx = 1
        dy = 0
        distance = 1
      }
      const nx = dx / distance
      const ny = dy / distance
      const overlap = minimum - distance
      const massA = collisionMass(a)
      const massB = collisionMass(b)
      const inverseA = 1 / massA
      const inverseB = 1 / massB
      const inverseTotal = inverseA + inverseB
      a.x -= nx * overlap * inverseA / inverseTotal
      a.y -= ny * overlap * inverseA / inverseTotal
      b.x += nx * overlap * inverseB / inverseTotal
      b.y += ny * overlap * inverseB / inverseTotal
      const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
      if (relativeVelocity < 0) {
        const impulse = -(1 + restitution) * relativeVelocity / inverseTotal
        a.vx -= impulse * nx * inverseA
        a.vy -= impulse * ny * inverseA
        b.vx += impulse * nx * inverseB
        b.vy += impulse * ny * inverseB
      }
      a.collisionFlash = .18
      b.collisionFlash = .18
    }
  }
  return next
}

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
  if (item.kind === 'momentum' || item.kind === 'wave') vx = item.speedValue ?? magnitude * 1.6
  if (item.kind === 'kineticEnergy') vx = item.speedValue ?? Math.sqrt(200 * magnitude)
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
      const strength = next.kind === 'work' && next.travelled > 160 ? 0
        : next.kind === 'work' ? (next.forceValue ?? magnitude)
          : (next.accelerationValue ?? magnitude)
      ax = next.directionX * strength
      ay = next.directionY * strength
    }
    if (next.kind === 'power') {
      const speed = Math.max(Math.hypot(next.vx, next.vy), 30)
      const force = next.forceValue ?? magnitude
      ax = next.directionX * (force * 100 / speed)
      ay = next.directionY * (force * 100 / speed)
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
  if (['newton', 'weight', 'electric', 'work', 'power'].includes(item.kind)) {
    if (item.outputSymbol === 'F' && item.parameters?.F === undefined) {
      next.outputValue = magnitude
      next.forceValue = magnitude
      next.accelerationValue = magnitude / Math.max(item.massValue ?? 1, .01)
      next.arrowValue = magnitude
      next.magnitude = magnitude
      return next
    }
    if (item.parameters?.F !== undefined) {
      const updated = refreshFormula({ ...next, parameters: { ...item.parameters, F: magnitude } })
      updated.directionX = directionX
      updated.directionY = directionY
      if (item.kind === 'work') {
        updated.travelled = 0
        updated.vx = 0
        updated.vy = 0
      }
      return updated
    }
    next.forceValue = magnitude
    next.arrowValue = magnitude
  }
  if (item.kind === 'work') {
    // Re-aiming the work arrow starts a fresh displacement run with the new force.
    next.travelled = 0
    next.vx = 0
    next.vy = 0
  } else if (item.kind === 'momentum' || item.kind === 'wave' || item.kind === 'kineticEnergy') {
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
