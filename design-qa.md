**Design QA: Premium Glownari Palette**

- Previous storefront reference: `/private/tmp/glownari-human-touch-desktop.png`
- Updated light theme: `/private/tmp/glownari-premium-light.png`
- Updated dark theme: `/private/tmp/glownari-premium-dark.png`
- Mobile cart state: `/private/tmp/glownari-premium-mobile-cart.png`
- Before/after comparison: `/private/tmp/glownari-premium-palette-comparison.png`
- Desktop viewport: `1440 x 1024`
- Mobile viewport: `390 x 844`

**Palette Direction**

- Primary: muted berry `#b62e59`, with deep berry `#8f2044` for hover and emphasis.
- Canvas: warm ivory-white surfaces instead of pink-tinted page backgrounds.
- Text: warm near-black with balanced mauve-gray secondary text.
- Supporting color: restrained deep teal for ratings, savings, stock, and trust indicators.
- Dark mode: near-black plum canvas, layered charcoal-plum surfaces, and softened rose accent.

**Checks**

- Home page inspected in light and dark themes.
- Cart inspected at `390px` in light theme.
- Mobile document width remains `390/390`.
- Header remains a solid surface without a decorative gradient.
- Buttons, inputs, badges, cards, popovers, checkout branding, and browser theme color use the shared palette.
- Browser console errors: `0`.
- Production build and TypeScript checks passed.

**Findings**

- No actionable P0, P1, or P2 contrast, color consistency, or responsive issues remain.
- Product and festival imagery retain their original colors so merchandise remains the visual focus.

final result: passed
