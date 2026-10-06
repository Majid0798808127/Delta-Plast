<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Design system

- Brand motion uses Embla Auto Scroll with a duplicated track, RTL-aware direction and reduced-motion pausing; why: seamless looping and touch dragging need a proven shared engine.
- Stat counters observe their first visibility and animate with requestAnimationFrame, exposing static targets to assistive technology; why: one-shot motion must preserve accuracy and reduced-motion accessibility.
- All colors, shadows and radii are semantic oklch tokens declared in `src/styles.css` and consumed through token classes (`bg-surface`, `text-ink`, `shadow-lift`). Never hardcode color utilities (`bg-[#…]`, `text-white`, `bg-black`) in components — they bypass theming.
  *Why:* the client switched themes once; retinting the site must stay a single-file change.
- The site is light-only by default. `:root` carries the light palette; the `.dark` block exists only so shadcn primitives stay valid. Don't add a theme toggle or dark surfaces without a product reason.
  *Why:* the client explicitly rejected the original dark treatment.
- Arabic is the default document language (`lang="ar" dir="rtl"` in the root shell), flipped to English at runtime by the page's language toggle. Use logical utilities (`start-`/`end-`, `border-s`, `ps-`/`pe-`) rather than `left`/`right` so both directions hold.
  *Why:* the same page must render correctly in both directions.
- Bilingual copy lives in one `T` dictionary at the top of the route file; add a key to both `ar` and `en` in the same edit.
  *Why:* a missing key renders a blank string instead of failing loudly.
- Contact field wrappers are module-level components with explicit accessible input names.
  *Why:* typing must retain focus across state updates, and validation must not change accessible labels.
- Header scrollspy uses document-ordered section positions, a requestAnimationFrame-throttled scroll listener and measured header offsets; scroll reveals remain one-shot and honor reduced motion.
  *Why:* tall sections, reverse scrolling, bilingual layouts and anchor navigation must stay accurate without altering content.
- The company page uses an image-gallery cover with overlapping local-brand imagery and unframed content sections; shared controls use the existing Button component.
  *Why:* the selected design must remain consistent while preserving accessible controls and bilingual direction.
- Load the R3F brand sculpture dynamically after hydration, resolve its colors from CSS tokens, and use local Lightformer lighting rather than remote presets.
  *Why:* preserve server rendering, theme consistency and reliable scene loading without external lighting assets.

