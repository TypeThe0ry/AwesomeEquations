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
  { id: 'springPeriod', text: 'T=2π√(m/k)', recipe: 'Tmk', kind: 'law' },
  { id: 'pendulumPeriod', text: 'T=2π√(L/g)', recipe: 'TLg', kind: 'law' },
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
    formats: { s: 's=ut+½at²', u: 'u=(s−½at²)/t', a: 'a=2(s−ut)/t²', t: 't=(√(u²+2as)−u)/a' },
    defaults: { s: 50, u: 0, a: 100, t: 1 },
    rules: { s: p => p.u * p.t + .5 * p.a * p.t ** 2, u: p => (p.s - .5 * p.a * p.t ** 2) / safeDenom(p.t), a: p => 2 * (p.s - p.u * p.t) / safeDenom(p.t ** 2), t: p => Math.abs(p.a) < 1e-8 ? p.s / safeDenom(p.u) : (Math.sqrt(p.u ** 2 + 2 * p.a * p.s) - p.u) / p.a },
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
    formats: { T: 'T=2π√(m/k)', m: 'm=k(T/2π)²', k: 'k=4π²m/T²' },
    defaults: { T: 1, m: 1, k: 1 },
    rules: { T: p => 2 * Math.PI * Math.sqrt(p.m / p.k), m: p => p.k * (p.T / (2 * Math.PI)) ** 2, k: p => 4 * Math.PI ** 2 * p.m / safeDenom(p.T ** 2) },
  },
  pendulumPeriod: {
    outputs: { T: ['L', 'g'], L: ['T', 'g'], g: ['T', 'L'] },
    formats: { T: 'T=2π√(L/g)', L: 'L=g(T/2π)²', g: 'g=4π²L/T²' },
    defaults: { T: 1, L: 1, g: 100 },
    rules: { T: p => 2 * Math.PI * Math.sqrt(p.L / p.g), L: p => p.g * (p.T / (2 * Math.PI)) ** 2, g: p => 4 * Math.PI ** 2 * p.L / safeDenom(p.T ** 2) },
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

// A consistent distance scale is shared by every law; displayed values are SI-like
// sandbox values (G, electromagnetic constants and light speed may be rescaled).
export const PIXELS_PER_UNIT = 12
const TAU = 2 * Math.PI
const safeDenom = value => Math.abs(value) < 1e-10 ? NaN : value
const modelFor = law => MODELS[law]

const DEFAULTS = {
  newton: { m: 1, a: 4, F: 4 }, weight: { m: 1, g: 9.81, F: 9.81 },
  gravity: { G: 20, M: 20, m: 1, r: 10 },
  velocityTime: { u: 0, a: 100, t: 1, v: 100 }, displacementTime: { v: 6, t: 2, s: 12 },
  acceleratedDisplacement: { u: 0, a: 100, t: 1, s: 50 }, escapeSpeed: { g: 9.81, h: 6, v: Math.sqrt(2 * 9.81 * 6) },
  impulse: { F: 100, t: 1, J: 100 }, spring: { k: 100, x: 1, F: -100 },
  springEnergy: { k: 100, e: 1, E: 50 }, dampedSpring: { k: 4, x: 4, c: .8, v: 0 },
  nonlinearSpring: { k: .3, x: 4 }, electric: { q: 1, E: 4, F: 4 },
  friction: { μ: .3, m: 1, g: 9.81 }, drag: { c: .5, v: 8 }, quadraticDrag: { c: .04, v: 8 },
  magnetic: { q: 1, v: 8, B: .5 }, centripetal: { m: 1, v: 8, r: 10 },
  angularCentripetal: { m: 1, ω: .8, r: 10 }, pendulum: { m: 1, g: 9.81, θ: .4 },
  momentum: { m: 1, v: 6, p: 6 }, kineticEnergy: { m: 1, v: 6, E: 18 },
  potentialEnergy: { m: 1, g: 9.81, h: 6, U: 58.86 }, gravityPotential: { G: 20, M: 20, m: 1, r: 10, U: -40 },
  angularMomentum: { m: 1, v: 10, r: 10, L: 100 }, torqueForce: { F: 2, r: 4, τ: 8 },
  torqueAngular: { I: 1, α: 100, τ: 100 }, angularAcceleration: { I: 8, τ: 4, α: .5 },
  momentInertia: { m: 1, r: 6, I: 36 }, angularVelocity: { v: 8, r: 10, ω: .8 },
  rotationalEnergy: { I: 8, ω: 1, K: 4 }, rotationalPower: { τ: 2, ω: 1, P: 2 },
  springPeriod: { m: 1, k: 4, T: Math.PI }, pendulumPeriod: { L: 10, g: 9.81, T: TAU * Math.sqrt(10 / 9.81) },
  work: { F: 4, d: 8, W: 32 }, power: { F: 2, v: 6, P: 12 }, wave: { f: .8, λ: 8, v: 6.4 },
  coulomb: { k: 40, Q: 1, q: 1, r: 10 }, pressure: { F: 100, A: 1, P: 100 },
  density: { m: 1, V: 1, ρ: 1 }, fluidPressure: { ρ: 1, g: 9.81, h: 6, P: 58.86 },
  buoyancy: { ρ: 1, V: 1, g: 100, F: 100 }, viscous: { η: .5, A: 1, v: 8, d: 1 },
  circleArea: { π: Math.PI, r: 6, A: Math.PI * 36 }, volume: { A: 16, h: 4, V: 64 },
  ohm: { V: 6, I: 2, R: 3 }, electricPower: { V: 6, I: 2, P: 12 },
  heat: { m: 1, c: 4, T: 20, Q: 80 }, photon: { h: 1, f: 1.5, E: 1.5 },
}
for (const [law, defaults] of Object.entries(DEFAULTS)) MODELS[law].defaults = { ...MODELS[law].defaults, ...defaults }

// Each recognized law has an explicit physical presentation. Algebraic and
// geometrical relations get their actual physical context, not an invented force.
export const VISUALS = {
  newton: 'force', weight: 'fall', gravity: 'field',
  velocityTime: 'acceleration', displacementTime: 'translation', acceleratedDisplacement: 'acceleration', escapeSpeed: 'fall',
  impulse: 'impulse', spring: 'spring', dampedSpring: 'spring', nonlinearSpring: 'spring', springEnergy: 'spring',
  electric: 'force', friction: 'resistance', drag: 'resistance', quadraticDrag: 'resistance', viscous: 'shear',
  magnetic: 'magnetic', centripetal: 'orbit', angularCentripetal: 'orbit', pendulum: 'pendulum',
  momentum: 'translation', kineticEnergy: 'translation', potentialEnergy: 'energyFall', gravityPotential: 'gravityOrbit',
  angularMomentum: 'orbit', torqueForce: 'rotor', torqueAngular: 'rotor', angularAcceleration: 'rotor',
  momentInertia: 'rotor', angularVelocity: 'orbit', rotationalEnergy: 'rotor', rotationalPower: 'rotor',
  springPeriod: 'spring', pendulumPeriod: 'pendulum', work: 'work', power: 'power', wave: 'wave', coulomb: 'field',
  pressure: 'piston', density: 'fluid', fluidPressure: 'hydrostatic', buoyancy: 'fluid',
  circleArea: 'area', volume: 'volume', ohm: 'circuit', electricPower: 'circuit', heat: 'thermal', photon: 'light',
}
const signature = text => [...normalize(text).replace(/[=+\-/()√π2]/g, '')].sort().join('')
const snippets = new Set(['mg', 'GMm', 'kx', 'cv', 'qE', 'IR', 'VI', 'mcT', 'hf'])
export function resolveFormula(raw) {
  const value = normalize(raw)
  let match
  for (const law of EQUATIONS) {
    const formats = MODELS[law.id].formats
    const output = Object.keys(formats).find(key => normalize(formats[key]) === value)
    if (output) { match = { law, output }; break }
    if ([law.text, ...(law.aliases ?? [])].some(text => normalize(text) === value)) {
      match = { law, output: Object.keys(formats)[0] }; break
    }
  }
  // Recipe inference is reserved for symbol composition. An incorrect explicit
  // equation such as F=m/a must never be silently rewritten as F=ma.
  if (!match && !/[+\-/]/.test(value)) {
    const law = EQUATIONS.find(entry => [entry.recipe, ...(entry.recipes ?? [])].some(recipe =>
      signature(recipe) === signature(value) || (entry.text.includes('²') && signature(recipe + '²') === signature(value))))
    if (law) {
      const first = [...value][0]
      match = { law, output: MODELS[law.id].outputs[first] ? first : Object.keys(MODELS[law.id].outputs)[0] }
    }
  }
  if (!match) return { text: raw, kind: [...value].length <= 1 || snippets.has(value) ? 'letter' : 'invalid', law: null }
  const { law, output } = match
  return { text: MODELS[law.id].formats[output], kind: law.kind, law: law.id, outputSymbol: output,
    inputSymbols: MODELS[law.id].outputs[output], visual: VISUALS[law.id] }
}

export function parameterMinimum(item, symbol) {
  if (symbol === 'π') return Math.PI
  // E is a signed electric field in F=qE; I is signed current in electrical laws.
  if (symbol === 'E' && item.law === 'electric') return -1000
  if (symbol === 'I' && ['ohm', 'electricPower'].includes(item.law)) return -1000
  if (symbol === 'V' && ['ohm', 'electricPower'].includes(item.law)) return -1000
  if (symbol === 'T' && item.law === 'heat') return -1000
  if (symbol === 'h' && item.law === 'photon') return .001
  return ['m', 'M', 'r', 'R', 'k', 'c', 'f', 'λ', 't', 'T', 'A', 'V', 'ρ', 'η', 'I', 'E', 'K', 'G', 'μ'].includes(symbol) ? .001 : -1000
}
export const arrowLength = value => clamp(26 + 32 * Math.log1p(Math.abs(value)), 26, 320)
export const arrowValueFromLength = length => Math.expm1(Math.max(0, length - 26) / 32)

export function refreshFormula(item) {
  const model = modelFor(item.law)
  if (!model) return { ...item, massValue: item.massValue ?? 1 }
  const inputSymbols = model.outputs[item.outputSymbol] ?? []
  const values = { ...model.defaults }
  for (const symbol of inputSymbols) values[symbol] = item.parameters?.[symbol] ?? values[symbol]
  values[item.outputSymbol] = model.rules[item.outputSymbol](values)
  let invalidReason = !Number.isFinite(values[item.outputSymbol]) ? '无实数解或除数为零' : ''
  for (const [symbol, value] of Object.entries(values)) {
    if (parameterMinimum(item, symbol) > 0 && value < 0) invalidReason = `${symbol} 不能为负数`
  }
  const mass = values.m ?? item.massValue ?? 1
  const visual = VISUALS[item.law]
  const forceValue = values.F ?? 0
  const accelerationValue = item.law === 'newton' ? values.a : forceValue / Math.max(mass, .001)
  const fieldForceValue = item.law === 'gravity' ? values.G * values.M * mass / (values.r ** 2)
    : item.law === 'coulomb' ? values.k * values.Q * values.q / (values.r ** 2) : 0
  return { ...item, visual, inputSymbols, parameters: Object.fromEntries(inputSymbols.map(key => [key, values[key]])),
    values, outputValue: values[item.outputSymbol], massValue: mass, forceValue, accelerationValue,
    speedValue: values.v, fieldForceValue, invalidReason,
    arrowValue: item.law === 'newton' ? values.a : values[item.outputSymbol], magnitude: arrowLength(item.law === 'newton' ? values.a : values[item.outputSymbol]) }
}
export const isField = item => VISUALS[item.law] === 'field'
export const isMass = item => item.kind === 'letter' && item.text === 'm'
export const isCharged = item => (item.kind === 'letter' && item.text === 'q') || (item.law && !!item.values?.q)
export const isSpringSource = item => VISUALS[item.law] === 'spring'
export const isDynamic = item => !!item.law && !item.invalidReason && !['field', 'area', 'volume', 'circuit', 'thermal', 'hydrostatic'].includes(VISUALS[item.law])
export const isDirectional = item => ['force', 'fall', 'acceleration', 'translation', 'impulse', 'work', 'power', 'resistance', 'shear', 'wave', 'light', 'piston'].includes(VISUALS[item.law])
export const isCollidable = item => !item.held && !item.invalidReason && !item.attachedTo &&
  (isMass(item) || ['force', 'fall', 'energyFall', 'acceleration', 'translation', 'impulse', 'work', 'power', 'resistance', 'shear', 'magnetic', 'wave', 'light', 'momentum', 'kineticEnergy'].includes(VISUALS[item.law] ?? item.kind))
export const fieldAutoScale = item => Math.min(3, Math.sqrt(Math.abs(item.fieldForceValue ?? 1) / 4))
export const fieldScaleFor = item => (item.fieldScale ?? 1) * fieldAutoScale(item)
export const collisionRadius = item => clamp(Math.max((item.width ?? 76) * .24, (item.height ?? 76) * .42), 22, 72)

export function defaultDirection(kind) {
  return kind === 'weight' ? { x: 0, y: 1 } : kind === 'newton' ? { x: -1, y: 0 } : { x: 1, y: 0 }
}
export function resetMotion(raw, viewport = { width: 1200, height: 800 }) {
  const item = refreshFormula(raw)
  const p = item.values ?? {}
  const visual = VISUALS[item.law]
  const direction = ['fall', 'energyFall'].includes(visual) ? { x: 0, y: 1 } : defaultDirection(item.kind)
  const radius = clamp(Math.abs(p.r ?? p.L ?? 10) * PIXELS_PER_UNIT, 40, Math.min(viewport.width, viewport.height) * .28)
  const motion = { vx: 0, vy: 0, ax: 0, ay: 0, age: 0, trail: [], travelled: 0,
    directionX: direction.x, directionY: direction.y, anchorX: item.x, anchorY: item.y,
    originX: item.x, originY: item.y, radius, fieldScale: item.fieldScale ?? 1,
    massValue: item.massValue ?? 1, magnitude: item.magnitude, theta: .4, omega: 0,
    rotation: 0, angularVelocity: 0, wavePhase: 0, phase: 0,
    fluidSurface: item.y - 80, pistonPosition: 0, energyReleased: 0,
    heightOrigin: Math.abs(p.h ?? 6), elapsedImpulse: 0, liveValues: { ...p }, visual }
  let v = 0
  if (['translation', 'wave'].includes(visual)) v = p.v ?? 6
  if (visual === 'light') v = 8 // Light speed is fixed in this rescaled illustration.
  if (visual === 'resistance' || visual === 'shear' || visual === 'magnetic') v = p.v ?? 8
  if (visual === 'acceleration') v = p.u ?? 0
  if (visual === 'power') v = p.v ?? 1
  motion.vx = direction.x * v * PIXELS_PER_UNIT
  motion.vy = direction.y * v * PIXELS_PER_UNIT
  if (['orbit', 'gravityOrbit'].includes(visual)) {
    motion.anchorX = item.x - radius
    motion.omega = item.law === 'gravityPotential' ? Math.sqrt(p.G * p.M / Math.abs(p.r) ** 3)
      : p.ω ?? ((p.v ?? 8) / Math.abs(p.r ?? 10))
    motion.vx = 0; motion.vy = motion.omega * radius
  }
  if (visual === 'rotor') motion.angularVelocity = p.ω ?? 0
  // I=mr² depicts a freely rotating body with an initial angular speed; it
  // does not manufacture a torque merely because inertia has been defined.
  if (item.law === 'momentInertia') motion.angularVelocity = 1
  if (visual === 'spring') {
    const extension = p.x ?? p.e ?? 4
    motion.anchorX = item.x - extension * PIXELS_PER_UNIT
  }
  if (visual === 'pendulum') {
    motion.theta = p.θ ?? .4
    motion.anchorX = item.x - Math.sin(motion.theta) * radius
    motion.anchorY = item.y - Math.cos(motion.theta) * radius
  }
  return motion
}

export function fieldAcceleration(item, fields) {
  const mass = Math.max(item.massValue ?? 1, .001)
  return fields.reduce((sum, raw) => {
    const field = refreshFormula(raw)
    if (field.id === item.id || field.invalidReason || (field.law === 'coulomb' && !isCharged(item))) return sum
    const dx = field.x - item.x, dy = field.y - item.y
    const distance = Math.max(Math.hypot(dx, dy), 24)
    const r = distance / PIXELS_PER_UNIT
    const p = field.values
    const strength = field.law === 'coulomb' ? -p.k * p.Q * (item.values?.q ?? 1) / (mass * r ** 2)
      : p.G * p.M / r ** 2
    return { ax: sum.ax + dx / distance * strength * PIXELS_PER_UNIT * (field.fieldScale ?? 1),
      ay: sum.ay + dy / distance * strength * PIXELS_PER_UNIT * (field.fieldScale ?? 1) }
  }, { ax: 0, ay: 0 })
}
export function springAcceleration(item, raw) {
  const spring = refreshFormula(raw), p = spring.values
  const dx = spring.x - item.x, dy = spring.y - item.y
  const distance = Math.max(Math.hypot(dx, dy), 1)
  const x = (distance - (item.springRestLength ?? 100)) / PIXELS_PER_UNIT
  const radialV = -((item.vx ?? 0) * dx + (item.vy ?? 0) * dy) / distance / PIXELS_PER_UNIT
  const mass = Math.max(item.massValue ?? 1, .001)
  const restoring = (p.k * (spring.law === 'nonlinearSpring' ? x ** 3 : x) + (p.c ?? 0) * radialV) / mass * PIXELS_PER_UNIT
  return { ax: dx / distance * restoring, ay: dy / distance * restoring }
}

// Only force-producing laws contribute a force. Momentum, energy and Newton's
// constitutive relation are never converted blindly into additional forces.
const forceLaws = new Set(['newton', 'weight', 'electric', 'friction', 'drag', 'quadraticDrag', 'viscous', 'pressure', 'fluidPressure', 'buoyancy', 'spring', 'dampedSpring', 'nonlinearSpring', 'springEnergy'])
export function interactionAcceleration(item, peers = []) {
  if (!item.interactionGroup) return { ax: 0, ay: 0 }
  const target = item.values ? item : refreshFormula(item)
  const constitutiveOnly = peers.some(peer => peer.law !== 'newton' && forceLaws.has(peer.law))
  return peers.reduce((sum, rawPeer) => {
    const peer = rawPeer.values ? rawPeer : { ...refreshFormula(rawPeer), ...rawPeer }
    if (peer.id === item.id || peer.interactionGroup !== item.interactionGroup || peer.invalidReason || !forceLaws.has(peer.law)) return sum
    if (peer.law === 'newton' && constitutiveOnly) return sum
    if (isSpringSource(peer)) {
      const result = springAcceleration({ ...item, springRestLength: item.springRestLength ?? 80 }, peer)
      return { ax: sum.ax + result.ax, ay: sum.ay + result.ay }
    }
    const p = peer.values, mass = Math.max(target.massValue ?? item.massValue ?? 1, .001)
    const vx = (target.vx ?? item.vx ?? 0) / PIXELS_PER_UNIT, vy = (target.vy ?? item.vy ?? 0) / PIXELS_PER_UNIT, speed = Math.hypot(vx, vy)
    if (['friction', 'drag', 'quadraticDrag', 'viscous'].includes(peer.law)) {
      const force = peer.law === 'friction' ? p.μ * mass * p.g
        : peer.law === 'drag' ? p.c * speed : peer.law === 'quadraticDrag' ? p.c * speed ** 2 : p.η * p.A * speed / p.d
      return speed ? { ax: sum.ax - vx / speed * force / mass * PIXELS_PER_UNIT, ay: sum.ay - vy / speed * force / mass * PIXELS_PER_UNIT } : sum
    }
    const force = peer.law === 'newton' ? rawPeer.forceValue ?? rawPeer.outputValue ?? p.F ?? 0
      : peer.law === 'weight' ? mass * p.g : peer.law === 'buoyancy' ? -p.ρ * (item.values?.V ?? p.V) * p.g : p.F ?? 0
    const direction = ['weight', 'buoyancy'].includes(peer.law) ? { x: 0, y: 1 } : { x: rawPeer.directionX ?? peer.directionX ?? 1, y: rawPeer.directionY ?? peer.directionY ?? 0 }
    const scale = peer.law === 'newton' ? 1 : PIXELS_PER_UNIT
    return { ax: sum.ax + direction.x * force / mass * scale, ay: sum.ay + direction.y * force / mass * scale }
  }, { ax: 0, ay: 0 })
}

export function stepItem(raw, dt, fields = [], spring = null, peers = []) {
  let next = raw.values ? { ...raw } : refreshFormula(raw)
  if (next.held || next.invalidReason || next.kind === 'invalid') return next
  const p = next.values ?? {}, mass = Math.max(next.massValue ?? 1, .001), visual = VISUALS[next.law]
  if (!next.law && !isMass(next) && !isCharged(next)) return next
  let remaining = Math.max(dt, 0)
  while (remaining > 1e-9) {
    const h = Math.min(remaining, 1 / 240)
    remaining -= h
    next.age = (next.age ?? 0) + h
    let ax = 0, ay = isMass(next) ? 9.81 * PIXELS_PER_UNIT : 0
    const external = fieldAcceleration(next, fields)
    const linked = interactionAcceleration(next, peers)
    const extra = { ax: external.ax + linked.ax, ay: external.ay + linked.ay }
    if (spring) { const force = springAcceleration(next, spring); extra.ax += force.ax; extra.ay += force.ay }
    const direction = { x: next.directionX ?? 1, y: next.directionY ?? 0 }
    const forcePeers = peers.filter(peer => peer.id !== next.id && peer.law !== 'newton' && forceLaws.has(peer.law))
    if (visual === 'field' || visual === 'area' || visual === 'volume' || visual === 'hydrostatic') {
      next.phase = next.age; continue
    }
    if (visual === 'circuit') {
      const current = p.I ?? 0
      next.phase = (next.phase ?? 0) + current * h
      next.energyReleased = (next.energyReleased ?? 0) + (p.V * p.I) * h
      continue
    }
    if (visual === 'thermal') {
      // Heating adds internal energy Q=mcΔT. No external translational force.
      next.phase = next.age * Math.sqrt(Math.max(0, 20 + p.T))
      next.thermalAmplitude = Math.sqrt(Math.max(0, 20 + p.T)) * .35
      continue
    }
    if (visual === 'rotor') {
      const inertia = p.I ?? mass * (p.r ?? 4) ** 2
      const torque = p.τ ?? 0
      let alpha = next.law === 'rotationalEnergy' ? 0 : torque / inertia
      if (next.law === 'angularAcceleration' || next.law === 'torqueAngular') alpha = p.α
      if (next.law === 'rotationalPower') alpha = p.τ / inertia
      next.angularVelocity = (next.angularVelocity ?? 0) + alpha * h
      next.rotation = (next.rotation ?? 0) + next.angularVelocity * h
      next.liveValues = { ...p, α: alpha, ω: next.angularVelocity, K: .5 * inertia * next.angularVelocity ** 2,
        P: torque * next.angularVelocity, I: inertia, τ: torque }
      next.ax = 0; next.ay = 0
      continue
    }
    if (visual === 'pendulum') {
      const length = p.L ?? next.radius / PIXELS_PER_UNIT
      const g = p.g ?? 9.81
      const theta = next.theta ?? .4
      const tangentX = Math.cos(theta), tangentY = -Math.sin(theta)
      // Both pendulum laws are the small-angle model, with T=2π√(L/g).
      const alpha = -g / length * theta + (extra.ax * tangentX + extra.ay * tangentY) / next.radius
      next.omega += alpha * h; next.theta += next.omega * h
      next.x = next.anchorX + Math.sin(next.theta) * next.radius
      next.y = next.anchorY + Math.cos(next.theta) * next.radius
      next.vx = Math.cos(next.theta) * next.radius * next.omega
      next.vy = -Math.sin(next.theta) * next.radius * next.omega
      next.ax = tangentX * alpha * next.radius; next.ay = tangentY * alpha * next.radius
      next.liveValues = { ...p, θ: next.theta, F: -mass * g * next.theta, T: TAU * Math.sqrt(length / g), v: Math.hypot(next.vx, next.vy) / PIXELS_PER_UNIT }
      continue
    }
    if (visual === 'orbit' || visual === 'gravityOrbit') {
      const radius = next.radius
      const theta = Math.atan2(next.y - next.anchorY, next.x - next.anchorX)
      const tx = -Math.sin(theta), ty = Math.cos(theta)
      next.omega += (extra.ax * tx + extra.ay * ty) / radius * h
      const angle = theta + next.omega * h
      next.x = next.anchorX + Math.cos(angle) * radius; next.y = next.anchorY + Math.sin(angle) * radius
      next.vx = -Math.sin(angle) * radius * next.omega; next.vy = Math.cos(angle) * radius * next.omega
      next.ax = -Math.cos(angle) * radius * next.omega ** 2; next.ay = -Math.sin(angle) * radius * next.omega ** 2
      const r = radius / PIXELS_PER_UNIT, v = r * next.omega
      next.liveValues = { ...p, r, v, ω: next.omega, F: mass * v ** 2 / r, L: mass * v * r, U: p.G ? -p.G * p.M * mass / r : p.U }
      continue
    }
    if (visual === 'spring') {
      const displacement = ((next.x - next.anchorX) * direction.x + (next.y - next.anchorY) * direction.y) / PIXELS_PER_UNIT
      const velocity = (next.vx * direction.x + next.vy * direction.y) / PIXELS_PER_UNIT
      const force = -p.k * (next.law === 'nonlinearSpring' ? displacement ** 3 : displacement) - (p.c ?? 0) * velocity
      ax = direction.x * force / mass * PIXELS_PER_UNIT; ay = direction.y * force / mass * PIXELS_PER_UNIT
      next.liveValues = { ...p, x: displacement, e: displacement, v: velocity, F: force, E: (next.law === 'nonlinearSpring' ? .25 * p.k * displacement ** 4 : .5 * p.k * displacement ** 2),
        T: TAU * Math.sqrt(mass / p.k) }
    }
    if (visual === 'force' || visual === 'fall' || visual === 'energyFall') {
      const acceleration = next.law === 'newton' && !forcePeers.length ? p.a : next.law === 'newton' ? 0
        : ['weight', 'escapeSpeed', 'potentialEnergy'].includes(next.law) ? p.g : p.F / mass
      ax = direction.x * acceleration * PIXELS_PER_UNIT; ay = direction.y * acceleration * PIXELS_PER_UNIT
    }
    if (visual === 'acceleration') { ax = direction.x * p.a * PIXELS_PER_UNIT; ay = direction.y * p.a * PIXELS_PER_UNIT }
    if (visual === 'impulse') {
      if (next.age <= Math.abs(p.t) + 1e-9) { ax = direction.x * p.F / mass * PIXELS_PER_UNIT; ay = direction.y * p.F / mass * PIXELS_PER_UNIT }
      next.elapsedImpulse = Math.min(next.age, Math.abs(p.t))
    }
    if (visual === 'work' || visual === 'power' || visual === 'piston') {
      const travelled = next.travelled / PIXELS_PER_UNIT
      const force = visual === 'work' && travelled >= Math.abs(p.d) ? 0 : p.F
      ax = direction.x * force / mass * PIXELS_PER_UNIT; ay = direction.y * force / mass * PIXELS_PER_UNIT
      next.pistonPosition = travelled
    }
    if (visual === 'fluid') {
      const volume = p.V, rho = next.law === 'density' ? p.ρ : mass / volume
      const fluidDensity = next.law === 'density' ? (next.fluidDensity ?? 1) : p.ρ
      const immersion = clamp((next.y - next.fluidSurface + (next.height ?? 76) / 2) / (next.height ?? 76), 0, 1)
      const g = p.g ?? 9.81
      ay = (g - fluidDensity * volume * g * immersion / mass) * PIXELS_PER_UNIT
      const damping = Math.exp(-1.2 * immersion * h)
      next.vx *= damping; next.vy *= damping
      next.liveValues = { ...p, ρ: rho, ρfluid: fluidDensity, F: fluidDensity * volume * g * immersion, m: mass, submerged: immersion }
    }
    ax += extra.ax; ay += extra.ay
    if (visual === 'magnetic') {
      const angularSpeed = p.q * p.B / mass
      const angle = angularSpeed * h
      const vx = next.vx * Math.cos(angle) - next.vy * Math.sin(angle)
      const vy = next.vx * Math.sin(angle) + next.vy * Math.cos(angle)
      ax += -next.vy * angularSpeed; ay += next.vx * angularSpeed
      next.vx = vx + extra.ax * h; next.vy = vy + extra.ay * h
    } else {
      // Exact constant-acceleration position step avoids timestep-dependent
      // errors in s=ut+½at² while the spring still uses small substeps.
      const oldX = next.x, oldY = next.y
      next.x += next.vx * h + .5 * ax * h ** 2; next.y += next.vy * h + .5 * ay * h ** 2
      next.vx += ax * h; next.vy += ay * h
      next.travelled += Math.hypot(next.x - oldX, next.y - oldY)
    }
    if (visual === 'resistance' || visual === 'shear') {
      const speed = Math.hypot(next.vx, next.vy) / PIXELS_PER_UNIT
      const force = next.law === 'friction' ? p.μ * mass * p.g
        : next.law === 'quadraticDrag' ? p.c * speed ** 2 : next.law === 'viscous' ? p.η * p.A * speed / p.d : p.c * speed
      const ratio = speed ? Math.max(0, 1 - force / mass * h / speed) : 0
      ax += (ratio - 1) * next.vx / h; ay += (ratio - 1) * next.vy / h
      next.vx *= ratio; next.vy *= ratio
      next.liveValues = { ...p, v: speed * ratio, F: -force }
    }
    if (visual === 'magnetic') { next.x += next.vx * h; next.y += next.vy * h }
    if ((visual === 'energyFall' || next.law === 'escapeSpeed') && next.y > next.originY + next.heightOrigin * PIXELS_PER_UNIT) {
      const ground = next.originY + next.heightOrigin * PIXELS_PER_UNIT
      next.y = 2 * ground - next.y; next.vy = -Math.abs(next.vy)
    }
    next.ax = ax; next.ay = ay
    if (visual === 'magnetic') next.travelled += Math.hypot(next.vx, next.vy) * h
    if (visual === 'wave' || visual === 'light') next.wavePhase += TAU * (p.f ?? 1) * h
    const v = Math.hypot(next.vx, next.vy) / PIXELS_PER_UNIT
    const signedV = (next.vx * direction.x + next.vy * direction.y) / PIXELS_PER_UNIT
    const displacement = ((next.x - next.originX) * direction.x + (next.y - next.originY) * direction.y) / PIXELS_PER_UNIT
    const acceleration = (ax * direction.x + ay * direction.y) / PIXELS_PER_UNIT
    if (!['spring', 'fluid', 'resistance', 'shear'].includes(visual)) {
      const live = { ...p, v: signedV, a: acceleration, m: mass }
      if (['translation', 'acceleration'].includes(visual)) { live.t = next.age; live.s = displacement; live.p = mass * signedV; live.E = .5 * mass * v ** 2 }
      if (visual === 'impulse') { live.J = p.F * next.elapsedImpulse; live.t = next.elapsedImpulse }
      if (visual === 'force' || visual === 'fall') {
        live.F = mass * acceleration
        if (next.law === 'escapeSpeed') live.h = Math.max(0, displacement)
      }
      if (visual === 'work') { live.d = Math.min(next.travelled / PIXELS_PER_UNIT, Math.abs(p.d)); live.W = p.F * live.d }
      if (visual === 'power') { live.P = p.F * signedV; live.W = p.F * displacement }
      if (visual === 'energyFall') {
        live.h = Math.max(0, next.heightOrigin - (next.y - next.originY) / PIXELS_PER_UNIT)
        live.U = mass * p.g * live.h; live.K = .5 * mass * v ** 2
      }
      if (visual === 'magnetic') live.F = p.q * v * p.B
      if (visual === 'translation') { live.p = mass * signedV; live.E = .5 * mass * v ** 2 }
      if (next.outputSymbol && next.inputSymbols && next.law !== 'escapeSpeed') {
        // Live outputs are evaluated from the same state used by the solver.
        const model = modelFor(next.law)
        if (model?.rules[next.outputSymbol]) live[next.outputSymbol] = model.rules[next.outputSymbol](live)
      }
      next.liveValues = live
    }
  }
  return next
}

export function resolveWorldCollisions(items, { width = 1200, floor = 660, restitution = .72 } = {}) {
  const next = items.map(item => ({ ...item }))
  for (const item of next) {
    if (!isCollidable(item)) continue
    const left = (item.width ?? 76) / 2, right = Math.max(left, width - left)
    const top = (item.height ?? 76) / 2, bottom = Math.max(top, floor - (item.height ?? 76) / 2)
    if (item.x < left || item.x > right) { item.x = clamp(item.x, left, right); item.vx *= -restitution; item.collisionFlash = .18 }
    if (item.y < top || item.y > bottom) { item.y = clamp(item.y, top, bottom); item.vy *= -restitution; item.collisionFlash = .18 }
  }
  for (let i = 0; i < next.length; i++) for (let j = i + 1; j < next.length; j++) {
    const a = next[i], b = next[j]
    if (!isCollidable(a) || !isCollidable(b) || (a.interactionGroup && a.interactionGroup === b.interactionGroup)) continue
    const dx = b.x - a.x, dy = b.y - a.y, distance = Math.max(Math.hypot(dx, dy), .001)
    const contact = collisionRadius(a) + collisionRadius(b)
    if (distance >= contact) continue
    const nx = distance === .001 ? 1 : dx / distance, ny = dy / distance
    const ia = 1 / Math.max(a.massValue ?? 1, .001), ib = 1 / Math.max(b.massValue ?? 1, .001)
    const overlap = contact - distance
    a.x -= nx * overlap * ia / (ia + ib); a.y -= ny * overlap * ia / (ia + ib)
    b.x += nx * overlap * ib / (ia + ib); b.y += ny * overlap * ib / (ia + ib)
    const velocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
    if (velocity < 0) {
      const impulse = -(1 + restitution) * velocity / (ia + ib)
      a.vx -= nx * impulse * ia; a.vy -= ny * impulse * ia
      b.vx += nx * impulse * ib; b.vy += ny * impulse * ib
    }
    a.collisionFlash = .18; b.collisionFlash = .18
  }
  return next
}

// Reconfiguration follows a user edit. Constant-speed, radius and period inputs
// alter the actual motion, rather than just changing a cosmetic arrow.
export function changeParameter(item, symbol, value) {
  const updated = refreshFormula({ ...item, parameters: { ...(item.parameters ?? {}), [symbol]: value } })
  updated.liveValues = { ...updated.values }
  const p = updated.values, visual = updated.visual
  if (['translation', 'wave', 'light', 'resistance', 'shear', 'magnetic'].includes(visual) && p.v !== undefined) {
    updated.vx = updated.directionX * p.v * PIXELS_PER_UNIT; updated.vy = updated.directionY * p.v * PIXELS_PER_UNIT
  }
  if (visual === 'acceleration' && symbol === 'u') {
    updated.vx = updated.directionX * p.u * PIXELS_PER_UNIT; updated.vy = updated.directionY * p.u * PIXELS_PER_UNIT
    updated.age = 0; updated.originX = updated.x; updated.originY = updated.y
  }
  if (visual === 'spring' && ['x', 'e'].includes(symbol)) {
    updated.anchorX = updated.x - (p.x ?? p.e) * PIXELS_PER_UNIT * updated.directionX
    updated.anchorY = updated.y - (p.x ?? p.e) * PIXELS_PER_UNIT * updated.directionY
    updated.vx = 0; updated.vy = 0
  }
  if (visual === 'orbit' || visual === 'gravityOrbit' || visual === 'pendulum') {
    const radius = clamp(Math.abs(p.r ?? p.L ?? updated.radius / PIXELS_PER_UNIT) * PIXELS_PER_UNIT, 24, 300)
    const dx = updated.x - updated.anchorX, dy = updated.y - updated.anchorY
    const distance = Math.max(Math.hypot(dx, dy), .001)
    updated.anchorX = updated.x - dx / distance * radius; updated.anchorY = updated.y - dy / distance * radius; updated.radius = radius
    if (visual !== 'pendulum') updated.omega = visual === 'gravityOrbit' ? Math.sqrt(p.G * p.M / Math.abs(p.r) ** 3) : p.ω ?? p.v / p.r
  }
  if (visual === 'rotor' && symbol === 'ω') updated.angularVelocity = p.ω
  if (visual === 'rotor' && updated.law === 'rotationalEnergy') updated.angularVelocity = p.ω
  if (visual === 'pendulum' && symbol === 'θ') {
    updated.theta = p.θ; updated.omega = 0
    updated.anchorX = updated.x - Math.sin(p.θ) * updated.radius
    updated.anchorY = updated.y - Math.cos(p.θ) * updated.radius
  }
  if (visual === 'spring' && updated.law === 'springEnergy' && symbol === 'E') {
    updated.anchorX = updated.x - p.e * PIXELS_PER_UNIT * updated.directionX
    updated.anchorY = updated.y - p.e * PIXELS_PER_UNIT * updated.directionY
  }
  if (visual === 'impulse') { updated.age = 0; updated.elapsedImpulse = 0 }
  if (visual === 'work') { updated.travelled = 0; updated.originX = updated.x; updated.originY = updated.y; updated.vx = 0; updated.vy = 0 }
  return updated
}

export function arrowInputFor(item) {
  const available = item.inputSymbols ?? []
  const priorities = isSpringSource(item) ? ['k', 'x', 'e', 'm', 'T']
    : item.law === 'newton' ? ['a', 'F', 'm']
      : item.visual === 'rotor' ? ['τ', 'α', 'F', 'ω', 'r', 'I', 'm']
        : ['F', 'a', 'g', 'v', 'u', 'E', 'B', 'G', 'M', 'k', 'ρ', 'h', 'J', 'p', 'f', 'λ', 'η', 'μ', 'c', 'r', 'A', 't']
  return priorities.find(symbol => available.includes(symbol)) ?? available.find(symbol => symbol !== 'π')
}
export function changeArrow(item, x, y, value) {
  const prepared = item.values ? item : refreshFormula(item)
  const symbol = prepared.law === 'kineticEnergy' ? 'E' : arrowInputFor(prepared)
  if (!symbol) return prepared
  let updated
  if (prepared.law === 'kineticEnergy' && symbol === 'E') {
    // The kinetic-energy arrow expresses energy magnitude; its visible speed
    // follows v=√(2E/m), so quadrupling the arrow length doubles the speed.
    const ratio = prepared.magnitude > 0 ? Math.max(value, .001) / prepared.magnitude : 1
    const targetEnergy = Math.max((prepared.outputValue ?? 0) * ratio, .001)
    const targetSpeed = Math.sqrt(2 * targetEnergy / Math.max(prepared.values?.m ?? 1, .001))
    updated = changeParameter(prepared, 'v', targetSpeed)
  } else {
    const amount = Math.max(value, .001) * ((prepared.parameters?.[symbol] ?? 1) < 0 ? -1 : 1)
    updated = changeParameter(prepared, symbol, amount)
  }
  updated.magnitude = value
  updated.directionX = x; updated.directionY = y
  if (isSpringSource(updated)) {
    const displacement = Math.hypot(updated.x - updated.anchorX, updated.y - updated.anchorY)
    updated.anchorX = updated.x - x * displacement; updated.anchorY = updated.y - y * displacement
  }
  if (['translation', 'wave', 'light', 'resistance', 'shear', 'magnetic'].includes(updated.visual)) {
    const speed = Math.hypot(updated.vx, updated.vy)
    updated.vx = x * speed; updated.vy = y * speed
  }
  return updated
}

export function readoutsFor(item) {
  const p = { ...(item.values ?? {}), ...(item.liveValues ?? {}) }
  const output = item.outputSymbol
  const extras = {
    acceleration: ['v', 's', 't'], translation: ['v', 'p', 'E'], spring: ['F', 'v', 'E', 'T'], pendulum: ['θ', 'T', 'v'],
    rotor: ['ω', 'α', 'K'], orbit: ['v', 'ω', 'L'], gravityOrbit: ['r', 'v', 'U'], energyFall: ['h', 'U', 'K'],
    impulse: ['J', 'v'], work: ['d', 'W', 'v'], power: ['P', 'W', 'v'], force: ['v'], fall: ['v'],
    magnetic: ['v', 'F'], fluid: ['F', 'ρfluid'], shear: ['v', 'F'], resistance: ['v', 'F'],
    circuit: ['P', 'Q'], thermal: ['ΔT'], wave: ['v', 'λ'], light: ['λ'], hydrostatic: ['P'],
  }[item.visual] ?? []
  const computed = { ...p }
  if (item.visual === 'circuit') { computed.P = item.values.V * item.values.I; computed.Q = item.energyReleased ?? 0 }
  if (item.visual === 'thermal') computed['ΔT'] = item.values.T
  if (item.visual === 'light') computed.λ = 8 / item.values.f
  const keys = [...new Set([output, ...(item.inputSymbols ?? []), ...extras])].filter(Boolean)
  return keys.filter(key => Number.isFinite(computed[key])).map(key => ({ symbol: key, value: computed[key], adjustable: item.inputSymbols?.includes(key) && key !== 'π' }))
}
