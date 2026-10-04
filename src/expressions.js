// A small arithmetic parser, never eval/Function. Adjacent symbols multiply.
const FUNCTIONS = { sin: Math.sin, cos: Math.cos, tan: Math.tan, sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp, log: Math.log }
export function parseExpression(source) {
  const input = source.replaceAll('−', '-').replaceAll('×', '*').replaceAll('·', '*').replaceAll('÷', '/').replaceAll('²', '^2').replaceAll('³', '^3').replaceAll('½', '(1/2)').replaceAll('√', 'sqrt')
  if (input.length > 400) throw new Error('公式过长')
  const tokens = []; let index = 0
  while (index < input.length) {
    if (/\s/.test(input[index])) { index++; continue }
    const number = input.slice(index).match(/^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/)
    const fn = input.slice(index).match(/^(sin|cos|tan|sqrt|abs|exp|log)(?=\s*\()/)
    if (number) { tokens.push({ type: 'number', value: Number(number[0]) }); index += number[0].length }
    else if (fn) { tokens.push({ type: 'function', value: fn[0] }); index += fn[0].length }
    else if (/[A-Za-zα-ωΑ-Ω]/u.test(input[index])) { tokens.push({ type: 'symbol', value: input[index++] }) }
    else if ('+-*/^()'.includes(input[index])) { tokens.push({ type: input[index++] }) }
    else throw new Error(`无法识别 “${input[index]}”`)
  }
  let cursor = 0
  const peek = () => tokens[cursor]?.type
  function primary() {
    const token = tokens[cursor++]
    if (!token) throw new Error('公式不完整')
    if (token.type === 'number') return { type: 'number', value: token.value }
    if (token.type === 'symbol') return { type: 'symbol', value: token.value }
    if (token.type === '(' || token.type === 'function') {
      if (token.type === 'function' && tokens[cursor++]?.type !== '(') throw new Error('函数缺少括号')
      const arg = sum()
      if (tokens[cursor++]?.type !== ')') throw new Error('括号不匹配')
      return token.type === 'function' ? { type: 'function', name: token.value, arg } : arg
    }
    throw new Error('公式不完整')
  }
  function power() { let left = primary(); if (peek() === '^') { cursor++; left = { type: '^', left, right: unary() } } return left }
  function unary() { if (peek() === '-' || peek() === '+') { const sign = tokens[cursor++].type; return { type: 'unary', sign, arg: unary() } } return power() }
  function product() {
    let left = unary()
    while (['*', '/', 'symbol', 'number', 'function', '('].includes(peek())) {
      const explicit = peek() === '*' || peek() === '/'
      const type = explicit ? tokens[cursor++].type : '*'
      left = { type, left, right: unary() }
    }
    return left
  }
  function sum() { let left = product(); while (peek() === '+' || peek() === '-') { const type = tokens[cursor++].type; left = { type, left, right: product() } } return left }
  const tree = sum()
  if (cursor !== tokens.length) throw new Error('公式含有多余字符')
  return tree
}
export function evaluateExpression(tree, values) {
  if (tree.type === 'number') return tree.value
  if (tree.type === 'symbol') return tree.value === 'π' ? Math.PI : values[tree.value]
  if (tree.type === 'unary') return (tree.sign === '-' ? -1 : 1) * evaluateExpression(tree.arg, values)
  if (tree.type === 'function') return FUNCTIONS[tree.name](evaluateExpression(tree.arg, values))
  const a = evaluateExpression(tree.left, values), b = evaluateExpression(tree.right, values)
  return { '+': () => a + b, '-': () => a - b, '*': () => a * b, '/': () => Math.abs(b) < 1e-12 ? NaN : a / b, '^': () => a ** b }[tree.type]()
}
export function expressionSymbols(tree) {
  if (tree.type === 'symbol') return tree.value === 'π' ? [] : [tree.value]
  if (tree.arg) return expressionSymbols(tree.arg)
  return tree.left ? [...new Set([...expressionSymbols(tree.left), ...expressionSymbols(tree.right)])] : []
}
const dimensions = {
  '': [0,0,0,0,0], 'kg': [1,0,0,0,0], 'm': [0,1,0,0,0], 's': [0,0,1,0,0], 'rad': [0,0,0,0,0],
  'm/s': [0,1,-1,0,0], 'm/s²': [0,1,-2,0,0], 'N': [1,1,-2,0,0], 'J': [1,2,-2,0,0], 'W': [1,2,-3,0,0],
  'kg·m/s': [1,1,-1,0,0], 'N·s': [1,1,-1,0,0], 'N·m': [1,2,-2,0,0], 'kg·m²': [1,2,0,0,0], 'kg·m²/s': [1,2,-1,0,0],
  'rad/s': [0,0,-1,0,0], 'rad/s²': [0,0,-2,0,0], 'N/m': [1,0,-2,0,0], 'N/m³': [1,-2,-2,0,0],
  'N·s/m': [1,0,-1,0,0], 'kg/m': [1,-1,0,0,0], 'kg/m³': [1,-3,0,0,0], 'm²': [0,2,0,0,0], 'm³': [0,3,0,0,0],
  'Pa': [1,-1,-2,0,0], 'Pa·s': [1,-1,-1,0,0], 'Hz': [0,0,-1,0,0], 'A': [0,0,0,1,0], 'C': [0,0,1,1,0],
  'V': [1,2,-3,-1,0], 'Ω': [1,2,-3,-2,0], 'T': [1,0,-2,-1,0], 'N/C': [1,1,-3,-1,0],
  'N·m²/kg²': [-1,3,-2,0,0], 'N·m²/C²': [1,3,-4,-2,0], 'J·s': [1,2,-1,0,0], 'K': [0,0,0,0,1], 'J/(kg·K)': [0,2,-2,0,-1],
}
export const dimensionForUnit = unit => dimensions[unit]
const same = (a,b) => a?.every((n,i) => Math.abs(n-b[i]) < 1e-8)
export function expressionDimension(tree, unitForSymbol) {
  if (tree.type === 'number') return dimensions['']
  if (tree.type === 'symbol') return dimensionForUnit(unitForSymbol(tree.value))
  if (tree.type === 'unary') return expressionDimension(tree.arg, unitForSymbol)
  if (tree.type === 'function') {
    const d = expressionDimension(tree.arg, unitForSymbol)
    if (tree.name === 'sqrt') return d.map(n => n / 2)
    if (tree.name === 'abs') return d
    if (!same(d, dimensions[''])) throw new Error('三角函数或指数的输入需要无量纲')
    return dimensions['']
  }
  const a = expressionDimension(tree.left, unitForSymbol), b = expressionDimension(tree.right, unitForSymbol)
  if (!a || !b) throw new Error('存在未定义的物理量')
  if (tree.type === '+' || tree.type === '-') { if (!same(a,b)) throw new Error('相加的物理量单位不同'); return a }
  if (tree.type === '^') { if (expressionSymbols(tree.right).length || !same(b, dimensions[''])) throw new Error('指数必须是无量纲常数'); const power = evaluateExpression(tree.right, {}); return a.map(n => n * power) }
  return a.map((n,i) => n + (tree.type === '/' ? -b[i] : b[i]))
}
export function validateExpressionUnits(tree, outputUnit, unitForSymbol) {
  if (!expressionSymbols(tree).length) return '' // Numeric assignments carry their left-hand unit.
  try { return same(expressionDimension(tree, unitForSymbol), dimensionForUnit(outputUnit)) ? '' : '等号两侧的物理单位不一致' }
  catch (error) { return error.message }
}
