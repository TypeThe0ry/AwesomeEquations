# Equation World

> A physics sandbox where equations become executable laws.

[![Deploy to GitHub Pages](https://github.com/TypeThe0ry/AwesomeEquations/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/TypeThe0ry/AwesomeEquations/actions/workflows/deploy-pages.yml) · [Live demo](https://typethe0ry.github.io/AwesomeEquations/)

Equation World lets you drag mathematical symbols onto a canvas, arrange them into equations, and watch the resulting rules affect a simulated world in real time.

## What is here

- Drag or click symbols to compose equations.
- Parse multiple equations as active laws.
- Run a mechanics world with force, gravity, spring, friction, drag, impulse,
  kinematics, energy, momentum, torque, rotation, pendulum, fluid, and collision rules.
- Use 49 supported relations, including `F=ma`, `F=GMm/r²`, `F=−kx`,
  `v=u+at`, `s=ut+½at²`, `J=Ft`, `p=mv`, `E=½mv²`, `U=mgh`,
  `L=mvr`, `τ=Iα`, `I=mr²`, `P=F/A`, `P=ρgh`, and `F=ρVg`.
- Place completed equations together to create an interaction group. Linked
  force laws act on the same moving formulas, while fields, springs, and
  collisions continue to work across the whole canvas.
- Switch between Mechanics, Electromagnetism, Thermodynamics, and Quantum symbol domains.
- Start from Gravity, Spring, Ohm, Heat, or Wave presets.

The current prototype focuses on the interaction loop. The domain tabs and law inspector are designed to grow into dedicated worlds for fields, thermal state, wave functions, and other physics models without replacing the equation interaction layer.

## Run locally

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` builds and publishes the site on every push to `main` using GitHub Actions.

## Topics

`physics` · `physics-simulation` · `equation-engine` · `interactive-simulation` · `educational-technology` · `react` · `vite` · `github-pages`

## License

MIT. See [LICENSE](./LICENSE).
