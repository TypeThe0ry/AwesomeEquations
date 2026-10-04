import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveFormula, refreshFormula, resetMotion, stepItem, fieldAcceleration, fieldScaleFor, interactionAcceleration, changeArrow, resolveWorldCollisions, collisionRadius } from '../src/physics.js'

function body(text, overrides = {}) {
  const item = { id: 1, ...resolveFormula(text), x: 500, y: 300, magnitude: 100, ...overrides }
  return { ...item, ...resetMotion(item) }
}
function advance(item, seconds, fields = []) {
  for (let t = 0; t < seconds; t += 1 / 120) item = stepItem(item, 1 / 120, fields)
  return item
}
const speed = (item) => Math.hypot(item.vx, item.vy)

test('only standalone mass falls; invalid charged expressions stay inactive', () => {
  assert.ok(stepItem(body('m'), .1).vy > 0)
  for (const text of ['g', 'M', 'a', 'nonsenseq']) {
    const item = stepItem(body(text), .1, [body('F=GMm/r²', { id: 2, x: 900 })])
    assert.equal(speed(item), 0)
  }
})

test('magnetic force bends the path without changing kinetic energy', () => {
  const initial = body('F=qvB')
  const final = advance(initial, 2)
  assert.ok(Math.abs(speed(final) - speed(initial)) < 1e-8)
  assert.ok(Math.abs(final.vy) > 50)
})

test('dissipative forces reduce speed without reversing velocity', () => {
  for (const text of ['F=−μmg', 'F=−cv', 'F=−cv²']) {
    const initial = body(text)
    const final = advance(initial, 3)
    assert.ok(speed(final) < speed(initial), text)
    assert.ok(final.vx >= 0, text)
  }
  assert.equal(speed(advance(body('F=−μmg'), 3)), 0)
})

test('spring damping removes mechanical energy', () => {
  const initial = body('F=−kx−cv')
  const final = advance(initial, 4)
  const energy = (item) => (item.vx ** 2 + item.vy ** 2 + 5 * ((item.x - item.anchorX) ** 2 + (item.y - item.anchorY) ** 2)) / 2
  assert.ok(energy(final) < energy(initial) * .05)
})

test('gravity contributions add and field strength follows the resize', () => {
  const mass = body('m')
  const left = body('F=GMm/r²', { id: 2, x: 200 })
  const right = body('F=GMm/r²', { id: 3, x: 800 })
  assert.ok(Math.abs(fieldAcceleration(mass, [left, right]).ax) < 1e-9)
  const weak = fieldAcceleration(mass, [right]).ax
  assert.ok(Math.abs(fieldAcceleration(mass, [{ ...right, fieldScale: 2 }]).ax - weak * 2) < 1e-9)
})

test('Coulomb field repels like charges and leaves neutral letters unaffected', () => {
  const source = body('F=kQq/r²', { id: 2, x: 800 })
  assert.ok(fieldAcceleration(body('q'), [source]).ax < 0)
  assert.equal(fieldAcceleration(body('m'), [source]).ax, 0)
  assert.equal(speed(stepItem(source, .2)), 0)
})

test('centripetal constraint preserves orbit radius and speed', () => {
  for (const text of ['F=mv²/r', 'F=mω²r']) {
    const initial = body(text)
    const final = advance(initial, 3)
    assert.ok(Math.abs(Math.hypot(final.x - final.anchorX, final.y - final.anchorY) - initial.radius) < 1e-8)
    assert.ok(Math.abs(speed(final) - speed(initial)) < 1e-8)
  }
})

test('kinetic-energy arrow sets speed according to the square-root law', () => {
  const initial = body('E=½mv²')
  const adjusted = changeArrow(initial, 0, -1, initial.magnitude * 4)
  assert.ok(Math.abs(speed(adjusted) / speed(initial) - 2) < 1e-9)
  assert.equal(adjusted.vx, 0)
  assert.ok(adjusted.vy < 0)
})

test('work exposes a force-driven displacement and re-aiming restarts the run', () => {
  const initial = body('W=Fd')
  const moved = advance(initial, .4)
  assert.ok(moved.travelled > 0)
  const adjusted = changeArrow(moved, 0, 1, 180)
  assert.equal(adjusted.travelled, 0)
  assert.equal(speed(adjusted), 0)
  assert.equal(adjusted.magnitude, 180)
})

test('formula collisions separate overlapping bodies and exchange normal velocity', () => {
  const a = { id: 1, kind: 'momentum', text: 'p=mv', x: 450, y: 300, width: 90, height: 76, vx: 120, vy: 0, held: false }
  const b = { id: 2, kind: 'momentum', text: 'p=mv', x: 500, y: 300, width: 90, height: 76, vx: -120, vy: 0, held: false }
  const collided = resolveWorldCollisions([a, b], { width: 1000, floor: 700 })
  assert.ok(collided[1].x - collided[0].x >= collisionRadius(a) + collisionRadius(b) - 1e-8)
  assert.ok(collided[0].vx < 0)
  assert.ok(collided[1].vx > 0)
  assert.ok(collided[0].collisionFlash > 0 && collided[1].collisionFlash > 0)
})

test('world boundaries bounce active formulas', () => {
  const item = { id: 1, kind: 'momentum', text: 'p=mv', x: 12, y: 300, width: 90, height: 76, vx: -120, vy: 0, held: false }
  const bounced = resolveWorldCollisions([item], { width: 1000, floor: 700 })[0]
  assert.ok(bounced.x >= item.width / 2)
  assert.ok(bounced.vx > 0)
})

test('spring force arrow controls stiffness and every spring carries a one kilogram mass', () => {
  const formula = refreshFormula({ id: 1, ...resolveFormula('F=−kx'), x: 500, y: 300, ...resetMotion(resolveFormula('F=−kx')) })
  const adjusted = changeArrow(formula, 1, 0, 240)
  assert.equal(adjusted.parameters.k, 240)
  assert.equal(adjusted.massValue, 1)
  assert.equal(adjusted.outputValue, -240)
})

test('field rings follow the force calculated by their equation', () => {
  const base = refreshFormula({ id: 1, ...resolveFormula('F=GMm/r²'), x: 500, y: 300, parameters: { G: 100, M: 100, m: 1, r: 10 }, ...resetMotion(resolveFormula('F=GMm/r²')) })
  const farther = refreshFormula({ ...base, parameters: { ...base.parameters, r: 20 } })
  assert.ok(fieldScaleFor(farther) < fieldScaleFor(base))
})

test('classical mechanics relations expose draggable inputs and computed outputs', () => {
  for (const [raw, output, expected] of [['v=uat', 'v', 100], ['sut½a', 's', 50], ['JFt', 'J', 100], ['½ke', 'E', 50], ['Lmvr', 'L', 100], ['τIα', 'τ', 100], ['PFA', 'P', 100], ['FρVg', 'F', 100]]) {
    const formula = resolveFormula(raw)
    const refreshed = refreshFormula({ id: 1, ...formula, x: 400, y: 300, ...resetMotion(formula) })
    assert.equal(refreshed.outputSymbol, output, raw)
    assert.equal(Math.round(refreshed.outputValue * 100) / 100, expected, raw)
    assert.ok(refreshed.inputSymbols.length >= 2, raw)
  }
})

test('linked equation groups combine visible force laws', () => {
  const mass = { ...body('m'), interactionGroup: 'g', interactionBody: true }
  const force = { ...body('F=ma', { id: 2 }), interactionGroup: 'g', interactionBody: true, forceValue: 40, outputValue: 40, directionX: 1, directionY: 0 }
  const acceleration = interactionAcceleration(mass, [mass, force])
  assert.equal(acceleration.ax, 40)
  assert.equal(acceleration.ay, 0)
})

test('new classical arrows change an input and refresh the output', () => {
  const formula = refreshFormula({ id: 1, ...resolveFormula('v=uat'), x: 400, y: 300, ...resetMotion(resolveFormula('v=uat')) })
  const adjusted = changeArrow(formula, 0, -1, 180)
  assert.equal(adjusted.parameters.a, 180)
  assert.equal(adjusted.outputValue, 180)
  assert.equal(adjusted.directionY, -1)
})
