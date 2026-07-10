# Internal presentations

Self-contained animated decks (single-file HTML), **hosted by the mockup itself** and linked
from the **Release notes** page. Audience: Ops, CS, Sales, Marketing & Product — so they keep
to the commercial / user-benefit story, not technical internals.

The decks are served statically from **`public/presentations/`**, so they're reachable at
`/presentations/<file>.html` on the mockup (dev and deployed) — no external hosting. Edit those
files directly to update.

| Deck | Served at | Opened from |
|------|-----------|-------------|
| Users at the client level | `/presentations/users-client-level.html` | Release notes → *Users now live at the client level* → **Watch the 2-minute walkthrough** |
| Pricing & config, by store & region | `/presentations/client-configuration.html` | Release notes → *Pricing & product config, now down to the store* → **See how it works** |

Both use the official shalion mark, are theme-aware (light/dark), and support keyboard +
autoplay navigation. Source of the deck bodies is `public/presentations/*.html`.
