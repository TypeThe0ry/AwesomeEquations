// Screen-space units keep the sandbox legible; the force laws still determine motion.
export const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
export const normalize = (text) => text.replaceAll('−', '-').replace(/\s/g, '').replaceAll('^2', '²').replaceAll('^3', '³').replaceAll('1/2', '½')

export const EQUATIONS = [
  { id: 'newton', text: 'F=ma', recipe: 'Fma', kind: 'newton' },
  { id: 'weight', text: 'F=mg', recipe: 'Fmg', kind: 'weight' },
  { id: 'gravity', text: 'F=GMm/r²', recipe: 'FGMmr', kind: 'gravity', aliases: ['F=GMm/R²'], recipes: ['FGMmR', 'FGMmrr', 'FGMmRR'] },
  { id: 'velocityTime', text: 'v=u+at', recipe: 'vuat', kind: 'kinematics' },
  { id: 'displacementTime', text: 's=vt', recipe: 'svt', kind: 'kinematics' },
  { id: 'acceleratedDisplacement', text: 's=ut+½at²', recipe: 'sut½a', kind: 'kinematics' },
  { id: 'escapeSpeed', text: 'v²=2gh', recipe: 'vgh', kind: 'kinematics' },
  { id: 'impulse', text: 'J=Ft', recipe: 'JFt', kind: 'impulse' },
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
  { id: 'potentialEnergy', text: 'U=mgh', recipe: 'Umgh', kind: 'law' },
  { id: 'gravityPotential', text: 'U=−GMm/r', recipe: 'UGMmr', kind: 'law' },
  { id: 'angularMomentum', text: 'L=mvr', recipe: 'Lmvr', kind: 'law' },
  { id: 'torqueForce', text: 'τ=Fr', recipe: 'τFr', kind: 'torque' },
  { id: 'torqueAngular', text: 'τ=Iα', recipe: 'τIα', kind: 'torque' },
  { id: 'momentInertia', text: 'I=mr²', recipe: 'Imr', kind: 'law' },
  { id: 'angularVelocity', text: 'ω=v/r', recipe: 'ωvr', kind: 'law' },
  { id: 'angularAcceleration', text: 'α=τ/I', recipe: 'ατI', kind: 'law' },
  { id: 'rotationalEnergy', text: 'K=½Iω²', recipe: 'K½Iω', kind: 'law', recipes: ['K½Iωω'] },
  { id: 'rotationalPower', text: 'P=τω', recipe: 'Pτω', kind: 'law' },
  { id: 'springPeriod', text: 'T²=mk', recipe: 'Tmk', kind: 'law' },
  { id: 'pendulumPeriod', text: 'T²=L/g', recipe: 'TLg', kind: 'law' },
  { id: 'work', text: 'W=Fd', recipe: 'WFd', kind: 'work' },
  { id: 'power', text: 'P=Fv', recipe: 'PFv', kind: 'power' },
  { id: 'wave', text: 'v=fλ', recipe: 'vfλ', kind: 'wave' },
  { id: 'coulomb', text: 'F=kQq/r²', recipe: 'FkQqr', kind: 'coulomb', aliases: ['F=kQq/R²'], recipes: ['FkQqR', 'FkQqrr', 'FkQqRR'] },
  { id: 'pressure', text: 'P=F/A', recipe: 'PFA', kind: 'law' },
  { id: 'density', text: 'ρ=m/V', recipe: 'ρmV', kind: 'law' },
  { id: 'fluidPressure', text: 'P=ρgh', recipe: 'Pρgh', kind: 'law' },
  { id: 'buoyancy', text: 'F=ρVg', recipe: 'FρVg', kind: 'fluid' },
  { id: 'viscous', text: 'F=ηAv/d', recipe: 'FηAvd', kind: 'fluid' },
  { id: 'circleArea', text: 'A=πr²', recipe: 'Aπr', kind: 'law' },
  { id: 'volume', text: 'V=Ah', recipe: 'VAh', kind: 'law' },
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
    rules: { F: p => p.m * p.a, a: p => p.F / safeDenom(p.m), m: p => p.F / safeDenom(p.a) },
  },
  weight: {
    outputs: { F: ['m', 'g'], g: ['F', 'm'], m: ['F', 'g'] },
    formats: { F: 'F=mg', g: 'g=F/m', m: 'm=F/g' },
    defaults: { F: 100, m: 1, g: 100 },
    rules: { F: p => p.m * p.g, g: p => p.F / safeDenom(p.m), m: p => p.F / safeDenom(p.g) },
  },
  gravity: {
    outputs: { F: ['G', 'M', 'm', 'r'], a: ['G', 'M', 'r'] },
    formats: { F: 'F=GMm/r²', a: 'a=GM/r²' },
    defaults: { F: 100, G: 100, M: 100, m: 1, r: 10, a: 100 },
    rules: { F: p => p.G * p.M * p.m / safeDenom(p.r ** 2), a: p => p.G * p.M / safeDenom(p.r ** 2) },
  },
  velocityTime: {
    outputs: { v: ['u', 'a', 't'], u: ['v', 'a', 't'], a: ['v', 'u', 't'], t: ['v', 'u', 'a'] },
    formats: { v: 'v=u+at', u: 'u=v−at', a: 'a=(v−u)/t', t: 't=(v−u)/a' },
    defaults: { v: 100, u: 0, a: 100, t: 1 },
    rules: { v: p => p.u + p.a * p.t, u: p => p.v - p.a * p.t, a: p => (p.v - p.u) / safeDenom(p.t), t: p => (p.v - p.u) / safeDenom(p.a) },
  },
  displacementTime: {
    outputs: { s: ['v', 't'], v: ['s', 't'], t: ['s', 'v'] },
    formats: { s: 's=vt', v: 'v=s/t', t: 't=s/v' },
    defaults: { s: 100, v: 100, t: 1 },
    rules: { s: p => p.v * p.t, v: p => p.s / safeDenom(p.t), t: p => p.s / safeDenom(p.v) },
  },
  acceleratedDisplacement: {
    outputs: { s: ['u', 'a', 't'], u: ['s', 'a', 't'], a: ['s', 'u', 't'], t: ['s', 'u', 'a'] },
    formats: { s: 's=ut+½at²', u: 'u=(s−½at²)/t', a: 'a=2(s−ut)/t²', t: 't=√(2s/a)' },
    defaults: { s: 50, u: 0, a: 100, t: 1 },
    rules: { s: p => p.u * p.t + .5 * p.a * p.t ** 2, u: p => (p.s - .5 * p.a * p.t ** 2) / safeDenom(p.t), a: p => 2 * (p.s - p.u * p.t) / safeDenom(p.t ** 2), t: p => Math.sqrt(Math.max(0, 2 * p.s / safeDenom(p.a))) },
  },
  escapeSpeed: {
    outputs: { v: ['g', 'h'], g: ['v', 'h'], h: ['v', 'g'] },
    formats: { v: 'v²=2gh', g: 'g=v²/2h', h: 'h=v²/2g' },
    defaults: { v: 100, g: 100, h: 50 },
    rules: { v: p => Math.sqrt(Math.max(0, 2 * p.g * p.h)), g: p => p.v ** 2 / safeDenom(2 * p.h), h: p => p.v ** 2 / safeDenom(2 * p.g) },
  },
  impulse: {
    outputs: { J: ['F', 't'], F: ['J', 't'], t: ['J', 'F'] },
    formats: { J: 'J=Ft', F: 'F=J/t', t: 't=J/F' },
    defaults: { J: 100, F: 100, t: 1 },
    rules: { J: p => p.F * p.t, F: p => p.J / safeDenom(p.t), t: p => p.J / safeDenom(p.F) },
  },
  spring: {
    outputs: { F: ['k', 'x'], x: ['F', 'k'], k: ['F', 'x'] },
    formats: { F: 'F=−kx', x: 'x=−F/k', k: 'k=−F/x' },
    defaults: { F: -100, k: 100, x: 1 },
    rules: { F: p => -p.k * p.x, x: p => -p.F / safeDenom(p.k), k: p => -p.F / safeDenom(p.x) },
  },
  springEnergy: {
    outputs: { E: ['k', 'e'], k: ['E', 'e'] },
    formats: { E: '½ke²', k: 'k=2E/e²' },
    defaults: { E: 100, k: 100, e: 1 },
    rules: { E: p => .5 * p.k * p.e ** 2, k: p => 2 * p.E / safeDenom(p.e ** 2) },
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
    rules: { F: p => p.q * p.E, q: p => p.F / safeDenom(p.E), E: p => p.F / safeDenom(p.q) },
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
    rules: { F: p => -p.c * p.v, c: p => -p.F / safeDenom(p.v), v: p => -p.F / safeDenom(p.c) },
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
    rules: { F: p => p.m * p.v ** 2 / safeDenom(p.r) },
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
    rules: { p: p => p.m * p.v, m: p => p.p / safeDenom(p.v), v: p => p.p / safeDenom(p.m) },
  },
  kineticEnergy: {
    outputs: { E: ['m', 'v'], m: ['E', 'v'], v: ['E', 'm'] },
    formats: { E: 'E=½mv²', m: 'm=2E/v²' },
    defaults: { E: 100, m: 1, v: 10 },
    rules: { E: p => .5 * p.m * p.v ** 2, m: p => 2 * p.E / safeDenom(p.v ** 2), v: p => Math.sqrt(Math.max(0, 2 * p.E / safeDenom(p.m))) },
  },
  potentialEnergy: {
    outputs: { U: ['m', 'g', 'h'], m: ['U', 'g', 'h'], g: ['U', 'm', 'h'], h: ['U', 'm', 'g'] },
    formats: { U: 'U=mgh', m: 'm=U/gh', g: 'g=U/mh', h: 'h=U/mg' },
    defaults: { U: 100, m: 1, g: 100, h: 1 },
    rules: { U: p => p.m * p.g * p.h, m: p => p.U / safeDenom(p.g * p.h), g: p => p.U / safeDenom(p.m * p.h), h: p => p.U / safeDenom(p.m * p.g) },
  },
  gravityPotential: {
    outputs: { U: ['G', 'M', 'm', 'r'], r: ['G', 'M', 'm', 'U'] },
    formats: { U: 'U=−GMm/r', r: 'r=−GMm/U' },
    defaults: { U: -100, G: 100, M: 100, m: 1, r: 100 },
    rules: { U: p => -p.G * p.M * p.m / safeDenom(p.r), r: p => -p.G * p.M * p.m / safeDenom(p.U) },
  },
  angularMomentum: {
    outputs: { L: ['m', 'v', 'r'], m: ['L', 'v', 'r'], v: ['L', 'm', 'r'], r: ['L', 'm', 'v'] },
    formats: { L: 'L=mvr', m: 'm=L/vr', v: 'v=L/mr', r: 'r=L/mv' },
    defaults: { L: 100, m: 1, v: 10, r: 10 },
    rules: { L: p => p.m * p.v * p.r, m: p => p.L / safeDenom(p.v * p.r), v: p => p.L / safeDenom(p.m * p.r), r: p => p.L / safeDenom(p.m * p.v) },
  },
  torqueForce: {
    outputs: { τ: ['F', 'r'], F: ['τ', 'r'], r: ['τ', 'F'] },
    formats: { τ: 'τ=Fr', F: 'F=τ/r', r: 'r=τ/F' },
    defaults: { τ: 100, F: 100, r: 1 },
    rules: { τ: p => p.F * p.r, F: p => p.τ / safeDenom(p.r), r: p => p.τ / safeDenom(p.F) },
  },
  torqueAngular: {
    outputs: { τ: ['I', 'α'], I: ['τ', 'α'], α: ['τ', 'I'] },
    formats: { τ: 'τ=Iα', I: 'I=τ/α', α: 'α=τ/I' },
    defaults: { τ: 100, I: 1, α: 100 },
    rules: { τ: p => p.I * p.α, I: p => p.τ / safeDenom(p.α), α: p => p.τ / safeDenom(p.I) },
  },
  momentInertia: {
    outputs: { I: ['m', 'r'], m: ['I', 'r'], r: ['I', 'm'] },
    formats: { I: 'I=mr²', m: 'm=I/r²', r: 'r=√(I/m)' },
    defaults: { I: 100, m: 1, r: 10 },
    rules: { I: p => p.m * p.r ** 2, m: p => p.I / safeDenom(p.r ** 2), r: p => Math.sqrt(Math.max(0, p.I / safeDenom(p.m))) },
  },
  angularVelocity: {
    outputs: { ω: ['v', 'r'], v: ['ω', 'r'], r: ['v', 'ω'] },
    formats: { ω: 'ω=v/r', v: 'v=ωr', r: 'r=v/ω' },
    defaults: { ω: 10, v: 100, r: 10 },
    rules: { ω: p => p.v / safeDenom(p.r), v: p => p.ω * p.r, r: p => p.v / safeDenom(p.ω) },
  },
  angularAcceleration: {
    outputs: { α: ['τ', 'I'], τ: ['I', 'α'], I: ['τ', 'α'] },
    formats: { α: 'α=τ/I', τ: 'τ=Iα', I: 'I=τ/α' },
    defaults: { α: 100, τ: 100, I: 1 },
    rules: { α: p => p.τ / safeDenom(p.I), τ: p => p.I * p.α, I: p => p.τ / safeDenom(p.α) },
  },
  rotationalEnergy: {
    outputs: { K: ['I', 'ω'], I: ['K', 'ω'], ω: ['K', 'I'] },
    formats: { K: 'K=½Iω²', I: 'I=2K/ω²', ω: 'ω=√(2K/I)' },
    defaults: { K: 100, I: 1, ω: 10 },
    rules: { K: p => .5 * p.I * p.ω ** 2, I: p => 2 * p.K / safeDenom(p.ω ** 2), ω: p => Math.sqrt(Math.max(0, 2 * p.K / safeDenom(p.I))) },
  },
  rotationalPower: {
    outputs: { P: ['τ', 'ω'], τ: ['P', 'ω'], ω: ['P', 'τ'] },
    formats: { P: 'P=τω', τ: 'τ=P/ω', ω: 'ω=P/τ' },
    defaults: { P: 100, τ: 100, ω: 1 },
    rules: { P: p => p.τ * p.ω, τ: p => p.P / safeDenom(p.ω), ω: p => p.P / safeDenom(p.τ) },
  },
  springPeriod: {
    outputs: { T: ['m', 'k'], m: ['T', 'k'], k: ['T', 'm'] },
    formats: { T: 'T²=mk', m: 'm=T²/k', k: 'k=T²/m' },
    defaults: { T: 1, m: 1, k: 1 },
    rules: { T: p => Math.sqrt(Math.max(0, p.m * p.k)), m: p => p.T ** 2 / safeDenom(p.k), k: p => p.T ** 2 / safeDenom(p.m) },
  },
  pendulumPeriod: {
    outputs: { T: ['L', 'g'], L: ['T', 'g'], g: ['T', 'L'] },
    formats: { T: 'T²=L/g', L: 'L=T²g', g: 'g=L/T²' },
    defaults: { T: 1, L: 1, g: 100 },
    rules: { T: p => Math.sqrt(Math.max(0, p.L / safeDenom(p.g))), L: p => p.T ** 2 * p.g, g: p => p.L / safeDenom(p.T ** 2) },
  },
  work: {
    outputs: { W: ['F', 'd'], F: ['W', 'd'], d: ['W', 'F'] },
    formats: { W: 'W=Fd', F: 'F=W/d', d: 'd=W/F' },
    defaults: { W: 100, F: 100, d: 1 },
    rules: { W: p => p.F * p.d, F: p => p.W / safeDenom(p.d), d: p => p.W / safeDenom(p.F) },
  },
  power: {
    outputs: { P: ['F', 'v'], F: ['P', 'v'], v: ['P', 'F'] },
    formats: { P: 'P=Fv', F: 'F=P/v', v: 'v=P/F' },
    defaults: { P: 100, F: 100, v: 1 },
    rules: { P: p => p.F * p.v, F: p => p.P / safeDenom(p.v), v: p => p.P / safeDenom(p.F) },
  },
  wave: {
    outputs: { v: ['f', 'λ'], f: ['v', 'λ'], λ: ['v', 'f'] },
    formats: { v: 'v=fλ', f: 'f=v/λ', λ: 'λ=v/f' },
    defaults: { v: 100, f: 10, λ: 10 },
    rules: { v: p => p.f * p.λ, f: p => p.v / safeDenom(p.λ), λ: p => p.v / safeDenom(p.f) },
  },
  coulomb: {
    outputs: { F: ['k', 'Q', 'q', 'r'], q: ['F', 'k', 'Q', 'r'] },
    formats: { F: 'F=kQq/r²', q: 'q=Fr²/kQ' },
    defaults: { F: 100, k: 100, Q: 1, q: 1, r: 1 },
    rules: { F: p => p.k * p.Q * p.q / safeDenom(p.r ** 2), q: p => p.F * p.r ** 2 / safeDenom(p.k * p.Q) },
  },
  pressure: {
    outputs: { P: ['F', 'A'], F: ['P', 'A'], A: ['F', 'P'] },
    formats: { P: 'P=F/A', F: 'F=PA', A: 'A=F/P' },
    defaults: { P: 100, F: 100, A: 1 },
    rules: { P: p => p.F / safeDenom(p.A), F: p => p.P * p.A, A: p => p.F / safeDenom(p.P) },
  },
  density: {
    outputs: { ρ: ['m', 'V'], m: ['ρ', 'V'], V: ['m', 'ρ'] },
    formats: { ρ: 'ρ=m/V', m: 'm=ρV', V: 'V=m/ρ' },
    defaults: { ρ: 1, m: 1, V: 1 },
    rules: { ρ: p => p.m / safeDenom(p.V), m: p => p.ρ * p.V, V: p => p.m / safeDenom(p.ρ) },
  },
  fluidPressure: {
    outputs: { P: ['ρ', 'g', 'h'], ρ: ['P', 'g', 'h'], h: ['P', 'ρ', 'g'] },
    formats: { P: 'P=ρgh', ρ: 'ρ=P/gh', h: 'h=P/ρg' },
    defaults: { P: 100, ρ: 1, g: 100, h: 1 },
    rules: { P: p => p.ρ * p.g * p.h, ρ: p => p.P / safeDenom(p.g * p.h), h: p => p.P / safeDenom(p.ρ * p.g) },
  },
  buoyancy: {
    outputs: { F: ['ρ', 'V', 'g'], ρ: ['F', 'V', 'g'], V: ['F', 'ρ', 'g'] },
    formats: { F: 'F=ρVg', ρ: 'ρ=F/Vg', V: 'V=F/ρg' },
    defaults: { F: 100, ρ: 1, V: 1, g: 100 },
    rules: { F: p => p.ρ * p.V * p.g, ρ: p => p.F / safeDenom(p.V * p.g), V: p => p.F / safeDenom(p.ρ * p.g) },
  },
  viscous: {
    outputs: { F: ['η', 'A', 'v', 'd'], η: ['F', 'A', 'v', 'd'] },
    formats: { F: 'F=ηAv/d', η: 'η=Fd/Av' },
    defaults: { F: 100, η: 1, A: 1, v: 100, d: 1 },
    rules: { F: p => p.η * p.A * p.v / safeDenom(p.d), η: p => p.F * p.d / safeDenom(p.A * p.v) },
  },
  circleArea: {
    outputs: { A: ['π', 'r'], r: ['A', 'π'] },
    formats: { A: 'A=πr²', r: 'r=√(A/π)' },
    defaults: { A: 314, π: Math.PI, r: 10 },
    rules: { A: p => p.π * p.r ** 2, r: p => Math.sqrt(Math.max(0, p.A / safeDenom(p.π))) },
  },
  volume: {
    outputs: { V: ['A', 'h'], A: ['V', 'h'], h: ['V', 'A'] },
    formats: { V: 'V=Ah', A: 'A=V/h', h: 'h=V/A' },
    defaults: { V: 100, A: 10, h: 10 },
    rules: { V: p => p.A * p.h, A: p => p.V / safeDenom(p.h), h: p => p.V / safeDenom(p.A) },
  },
  ohm: {
    outputs: { V: ['I', 'R'], I: ['V', 'R'], R: ['V', 'I'] },
    formats: { V: 'V=IR', I: 'I=V/R', R: 'R=V/I' },
    defaults: { V: 100, I: 10, R: 10 },
    rules: { V: p => p.I * p.R, I: p => p.V / safeDenom(p.R), R: p => p.V / safeDenom(p.I) },
  },
  electricPower: {
    outputs: { P: ['V', 'I'], V: ['P', 'I'], I: ['P', 'V'] },
    formats: { P: 'P=VI', V: 'V=P/I', I: 'I=P/V' },
    defaults: { P: 100, V: 10, I: 10 },
    rules: { P: p => p.V * p.I, V: p => p.P / safeDenom(p.I), I: p => p.P / safeDenom(p.V) },
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
    rules: { E: p => p.h * p.f, h: p => p.E / safeDenom(p.f), f: p => p.E / safeDenom(p.h) },
  },
}

const modelFor = (law) => MODELS[law] ?? null
const safeDenom = (value) => Math.abs(value) < .01 ? (value < 0 ? -.01 : .01) : value

const signature = (text) => [...normalize(text).replace(/[=+\-/]/g, '')].sort().join('')
const snippets = new Set(['mg', 'GMm', 'kx', 'cv', 'qE', 'IR', 'VI', 'mcT', 'hf'])

function outputFromRaw(raw, model, fallback) {
  if (!model) return fallback
  const value = normalize(raw)
  const left = value.includes('=') ? value.slice(0, value.indexOf('=')) : value
  // When a relation has no explicit equals sign, the first dragged symbol is
  // the intended output. A leading constant such as ½ has no output symbol,
  // so keep the model's default instead of accidentally choosing k or e.
  const candidate = value.includes('=')
    ? [...left].find((symbol) => model.outputs[symbol])
    : (model.outputs[[...left][0]] ? [...left][0] : null)
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
  const fieldForceValue = ['gravity', 'coulomb'].includes(item.kind)
    ? Math.abs(outputValue * (item.kind === 'gravity' && item.outputSymbol === 'a' ? massValue : 1))
    : undefined
  const parameters = Object.fromEntries(inputSymbols.map((symbol) => [symbol, values[symbol]]))
  const arrowValue = item.kind === 'newton' ? accelerationValue
    : ['work', 'power'].includes(item.law) || item.outputSymbol === 'F'
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
    fieldForceValue,
    arrowValue,
    // Keep the arrow readable while preserving the exact calculated value below the formula.
    magnitude: clamp(Math.abs(arrowValue) || 28, 28, 360),
  }
}

export const isField = (item) => ['gravity', 'coulomb'].includes(item.kind)
// `fieldScale` is the user-controlled multiplier. The automatic component follows
// the force represented by the equation so changing G, M, m, r, k, Q, or q also
// changes the drawn field immediately.
export const fieldAutoScale = (item) => clamp(Math.sqrt(Math.abs(item.fieldForceValue ?? item.forceValue ?? item.outputValue ?? 100) / 100), .45, 3)
export const fieldScaleFor = (item) => clamp((item.fieldScale ?? 1) * fieldAutoScale(item), .35, 4)
export const isSpringSource = (item) => ['spring', 'springEnergy'].includes(item.kind)
export const isDynamic = (item) => !['letter', 'invalid', 'law', 'gravity', 'coulomb', 'springEnergy'].includes(item.kind)
export const isDirectional = (item) => ['newton', 'weight', 'electric', 'momentum', 'kineticEnergy', 'work', 'power', 'wave', 'kinematics', 'impulse', 'fluid', 'torque'].includes(item.kind)
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
  return ['weight'].includes(kind) ? { x: 0, y: 1 }
    : ['buoyancy'].includes(kind) ? { x: 0, y: -1 }
      : kind === 'newton' ? { x: -1, y: 0 } : { x: 1, y: 0 }
}

export function resetMotion(item, viewport = { width: 1200, height: 800 }) {
  const direction = item.law === 'buoyancy' ? { x: 0, y: -1 } : defaultDirection(item.kind)
  const magnitude = item.magnitude ?? 100
  const scale = Math.min(viewport.width / 1200, viewport.height / 800, 1)
  const radius = Math.max(45, 110 * scale)
  let vx = 0, vy = 0
  if (['friction', 'drag', 'quadraticDrag', 'magnetic'].includes(item.kind)) vx = 180
  if (item.kind === 'spring') vx = 130
  if (item.kind === 'momentum' || item.kind === 'wave') vx = item.speedValue ?? magnitude * 1.6
  if (item.kind === 'kineticEnergy') vx = item.speedValue ?? Math.sqrt(200 * magnitude)
  if (item.kind === 'power') vx = 40
  if (item.kind === 'kinematics' && (item.outputSymbol === 'v' || item.law === 'displacementTime')) vx = item.outputValue ?? magnitude
  const motion = {
    vx, vy, ax: 0, ay: 0, age: 0, trail: [],
    directionX: direction.x, directionY: direction.y,
    anchorX: item.x, anchorY: item.y, radius,
    fieldScale: item.fieldScale ?? 1, magnitude,
    massValue: item.massValue ?? 1,
    wavePhase: 0, travelled: 0, rotation: 0, angularVelocity: 0, impulseApplied: false,
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
    const strength = sign * 12_000_000 * fieldScaleFor(field) / distance ** 2
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

// Equations dropped on top of one another share an interaction group. Force
// equations in that group contribute to the motion of the other members, so a
// mass can respond to several visible laws at once instead of becoming an
// isolated animation.
export function interactionAcceleration(item, peers = []) {
  if (!item.interactionGroup || !peers.length) return { ax: 0, ay: 0 }
  return peers.reduce((sum, peer) => {
    if (peer.id === item.id || ['letter', 'invalid', 'law', 'gravity', 'coulomb', 'springEnergy'].includes(peer.kind)) return sum
    if (peer.kind === 'spring') {
      const elastic = springAcceleration(item, peer)
      return { ax: sum.ax + elastic.ax, ay: sum.ay + elastic.ay }
    }
    const direction = peer.directionX === undefined ? defaultDirection(peer.kind) : { x: peer.directionX, y: peer.directionY }
    const mass = Math.max(Math.abs(item.massValue ?? 1), .01)
    const force = peer.forceValue ?? peer.outputValue
    if (!Number.isFinite(force)) return sum
    if (['friction', 'drag', 'quadraticDrag', 'viscous'].includes(peer.kind)) {
      const speed = Math.hypot(item.vx ?? 0, item.vy ?? 0)
      if (!speed) return sum
      const drag = peer.kind === 'friction' ? Math.abs(force)
        : peer.kind === 'quadraticDrag' ? Math.abs(force) * speed / 100
          : Math.abs(force) / 90 * speed
      return { ax: sum.ax - (item.vx / speed) * drag / mass, ay: sum.ay - (item.vy / speed) * drag / mass }
    }
    const sign = peer.kind === 'buoyancy' ? 1 : 1
    return { ax: sum.ax + direction.x * force * sign / mass, ay: sum.ay + direction.y * force * sign / mass }
  }, { ax: 0, ay: 0 })
}

// Pure integrator, shared by the app and physical-invariant tests.
export function stepItem(item, dt, fields = [], spring = null, peers = []) {
  const next = { ...item, age: item.age + dt }
  if (!isDynamic(item) && !isMass(item) && !isCharged(item)) return next
  let remaining = dt
  while (remaining > 1e-8) {
    const h = Math.min(remaining, 1 / 120)
    remaining -= h
    let ax = 0, ay = isMass(next) ? 620 : 0
    const magnitude = next.magnitude ?? 100
    if (next.kind === 'kinematics') {
      const value = next.outputValue ?? magnitude
      if (next.outputSymbol === 'v' || next.law === 'displacementTime') {
        // v=... and s=vt describe translational motion directly.
        next.vx = next.directionX * value
        next.vy = next.directionY * value
      } else {
        ax = next.directionX * value
        ay = next.directionY * value
      }
    }
    if (next.kind === 'impulse' && !next.impulseApplied) {
      const impulse = next.outputValue ?? magnitude
      const mass = Math.max(Math.abs(next.massValue ?? 1), .01)
      next.vx += next.directionX * impulse / mass
      next.vy += next.directionY * impulse / mass
      next.impulseApplied = true
    }
    if (next.kind === 'fluid') {
      const force = next.forceValue ?? next.outputValue ?? magnitude
      const mass = Math.max(Math.abs(next.massValue ?? 1), .01)
      ax = next.directionX * force / mass
      ay = next.directionY * force / mass
      if (next.law === 'viscous') {
        ax -= next.vx * Math.abs(force) / 180
        ay -= next.vy * Math.abs(force) / 180
      }
    }
    if (next.kind === 'torque') {
      const torque = next.outputValue ?? magnitude
      next.angularVelocity += torque / Math.max(next.massValue ?? 1, .1) * h
      next.rotation += next.angularVelocity * h
      next.ax = 0
      next.ay = 0
    }
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
    const linked = interactionAcceleration(next, peers)
    ax += linked.ax
    ay += linked.ay
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
  if (item.kind === 'spring' && item.outputSymbol === 'F') {
    // The spring arrow is the force readout. Its length controls k while the
    // signed force still follows F = -kx (or the nonlinear/damped variant).
    const updated = refreshFormula({ ...next, parameters: { ...item.parameters, k: magnitude } })
    updated.directionX = directionX
    updated.directionY = directionY
    updated.anchorX = item.x + directionX * 60
    updated.anchorY = item.y + directionY * 60
    return updated
  }
  if (['kinematics', 'impulse', 'fluid', 'torque'].includes(item.kind) && item.inputSymbols?.length) {
    const symbol = item.inputSymbols.includes('a') ? 'a'
      : item.inputSymbols.includes('F') ? 'F'
        : item.inputSymbols.includes('g') ? 'g' : item.inputSymbols[0]
    const updated = refreshFormula({ ...next, parameters: { ...item.parameters, [symbol]: magnitude } })
    updated.directionX = directionX
    updated.directionY = directionY
    if (item.kind === 'impulse') updated.impulseApplied = false
    return updated
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
