**Design QA: Glownari Reference Redesign**

- Reference images: user-provided Glownari homepage and sale product grid screenshots.
- Target viewport style: desktop jewelry ecommerce, warm ivory canvas, berry accent, image-led cards.
- Local preview: `http://localhost:3001`

**Implemented Checks**

- Header now matches the reference structure: logo left, centered search, right Track/cart/account/theme actions.
- Secondary navigation now uses centered Home, Earrings, Rings, and Support items with icon labels and active underline.
- Hero now uses a large ring festival banner with serif display headline, sale metadata, coupon, and two CTAs.
- Collection cards now provide Earrings and Rings image banners below the hero.
- Product sale section now uses a 4-column desktop grid with jewelry product cards, rupee pricing, and pink Add to cart actions.
- Search placeholder and quick terms now target earrings/rings instead of generic marketplace categories.
- Offline/demo fallback catalog now contains jewelry categories and eight ring/earring products.

**Verification**

- `npm run build` passed.
- `curl -I http://localhost:3001` returned `HTTP/1.1 200 OK`.

**Limit**

- Browser screenshot tooling was not available in this session, so this pass is build and served-page verified rather than pixel-overlay verified.
