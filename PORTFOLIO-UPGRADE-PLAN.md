# Portfolio Upgrade Plan

Tracking enhancements to the CV1 portfolio site.

---

## Terminal CLI

- [x] Typewriter output (10ms/char, skip on keypress, respects prefers-reduced-motion)
- [x] Tab completion (0/1/2+ match behaviour)
- [x] `help` grouping by category (info / navigation / fun), `help --all` flag
- [x] Command history persisted to `localStorage` (key: `cli-history`, cap 50)
- [x] Mobile UX: no auto-focus on <768px, panel height 280px, output word-wrap

## Easter eggs

Hidden commands (category: `fun`, not shown in `help`). Discovered by typing directly.

| Command      | Output / behaviour                                                  |
|--------------|---------------------------------------------------------------------|
| `whoami`     | `alan`                                                              |
| `motorsport` | `F1 for the strategy. / WRC for the raw driving.`                  |
| `f1`         | Favorite team and driver (placeholders to be filled in)            |
| `wrc`        | `Nothing beats Tarmac at night.`                                    |
| `coffee`     | Small ASCII coffee cup (4 lines)                                    |
| `joke`       | Random item from 5 programming jokes                                |
| `ascii`      | Block-font "ALAN" (5 lines, █ characters)                          |
| `sudo`       | `nice try.`                                                         |
| `rm`         | `lol no.` — intercepts any `rm …` invocation                       |
| `exit`/`quit`| `nowhere to go. you're already here.`                              |
| `secret`     | `try \`konami\`...` — hints at the Konami sequence                 |
| `konami`     | Triggers the sparkle effect (or `✨ unlocked` if reduced-motion)   |

## Konami code

Global `keydown` listener on `document` for: ↑ ↑ ↓ ↓ ← → ← → B A.
Spawns 30 coloured dots at random viewport positions, each fading in then out over 2 s via `@keyframes konami-sparkle`. Dots are `position: fixed; pointer-events: none; z-index: 9999` so they never block interaction. Reduced-motion: effect is skipped entirely.

---

## Backlog

- [ ] Replace `<PLACEHOLDER>` values in `f1` command
- [ ] Add more jokes to the `joke` pool
- [ ] Animate ASCII art reveal on `ascii` command
