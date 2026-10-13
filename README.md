# WellSolveAble Production Loss Prototype

Standalone React prototype for PM review. It uses mock data only and has no Supabase, authentication,
analytics, or production application dependencies.

## Run

```bash
bun install
bun run dev
```

Main routes:

- `/wells`
- `/wells/new`
- `/wells/f-120`
- `/wells/f-120/status`
- `/wells/f-120/production`
- `/wells/f-120/production/update`
- `/reports/new/production-impact`
- `/reports/new/costs`

## Verify

```bash
bun run lint
bun run build
```
