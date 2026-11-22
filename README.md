# AI Terminology

A small browser game for learning the AI terminology every vibecoder runs into: LLM, tokens, context window, compaction, memory, harness, agents, MCP, skills and more.

**Play it:** https://banditdev-git.github.io/ai-terminology/

Each one starts with a short card, then one question checks that you got it. Correct answers earn coins, which you spend upgrading a little low-poly AI rig: GPU, VRAM, cooling, training data, parameters and context window. Drag the rig to rotate it.

## Run it
```bash
npm install
npm run dev      # local dev server
npm run build    # static site in dist/
```

## Add or edit terminology
All content is in [`src/data/terms.ts`](src/data/terms.ts). Each entry has an `info` card, a question `q`, and 3 choices with exactly one `correct: true`. Every choice has a `why` that explains it.

`**double asterisks**` highlight a key phrase and `` `backticks` `` show code, in both `info` and `why`.

## Economy
- First correct answer on each one: 10 coins. After that: 2 coins. Re-reading the card halves it.
- One perfect run (20 × 10 = 200 coins) buys every upgrade (180 coins).

Testing tip: add `?coins=100` to the URL.

## Deploy
Every push to `main` builds and publishes to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). `base: './'` in `vite.config.ts` makes the build work under any path.

Built with React, Vite and react-three-fiber. MIT licensed.
