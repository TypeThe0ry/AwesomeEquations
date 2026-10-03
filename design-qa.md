# Design QA — Equation World prototype

source visual truth: user-provided inline reference screenshots in the conversation (Equation World concept)
implementation screenshot: `/workspace/AwesomeEquations/prototype.png`
viewport: 1440 × 1000 CSS px, deviceScaleFactor 1
source and implementation pixel dimensions: source screenshots are mobile-video crops with varied dimensions; implementation is 1440 × 1000. The comparison is normalized to the shared visual regions rather than treating the video controls as product UI.
state: initial Mechanics field, running simulation, two active equations (`F = ma` and `F = mg`)

## Evidence

- Full-view comparison: the implementation preserves the reference's warm off-white canvas, sparse scientific workspace, large serif math symbols, right-side rounded symbol palette, visible force/body state, and a thin ground line.
- Focused region comparison: the symbol dock keeps the four-column mathematical token rhythm and the formula canvas keeps separate equation rows with force annotation and a moving point mass. The prototype adds domain tabs and an inspector below the canvas so the executable-law model is legible without leaving the primary workspace.
- Primary interactions tested in a Chromium render: initial page load, active law discovery, preset selection (`F = −kx`), domain tab selection (`电磁`), symbol palette click, running/paused control, and reset state.
- Console errors checked: none observed during the render and interaction smoke test.

## Findings

No actionable P0, P1, or P2 findings remain for the current prototype scope. The extra header, domain tabs, preset strip, and law inspector are intentional extensions required to make the equation-engine interaction understandable and testable.

## Follow-up Polish

- P3: add a denser hand-drawn equation halo and particle trails closer to the source video once the simulation engine has more world types.
- P3: replace the temporary `⌫` clear control with the final icon set when the product icon direction is chosen.
- P3: add a dedicated equation edit state with proximity snapping and fraction/exponent layout helpers.

final result: passed
