# Equation World

> A physics sandbox where equations become executable laws.

Equation World lets you drag mathematical symbols onto a canvas, arrange them into equations, and watch the resulting rules affect a simulated world in real time.

## What is here

- Drag or click symbols to compose equations.
- Parse multiple equations as active laws.
- Run a small mechanics world with Newtonian force, gravity, and spring rules.
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

Every push to `main` runs the workflow in `.github/workflows/deploy-pages.yml` and publishes the Vite build to GitHub Pages.

## Topics

`physics` · `physics-simulation` · `equation-engine` · `interactive-simulation` · `educational-technology` · `react` · `vite` · `github-pages`

## License

MIT. See [LICENSE](./LICENSE).
