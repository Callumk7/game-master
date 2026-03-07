# Game Master Monorepo

A Dungeons & Dragons campaign management tool with a Phoenix/Elixir backend and React/TanStack frontend.

## Project Structure

This monorepo uses `pnpm` workspaces and Turbo for build orchestration:

- **packages/** - Shared packages and utilities
- **apps/** - Application services (API handler, Remix client)

The separation enables code sharing between the API and frontend while maintaining clean package boundaries.

## Development

Install dependencies:
```bash
pnpm install
```

Run development servers:
```bash
pnpm dev
```

Run tests:
```bash
pnpm test
```

See individual package READMEs for more detailed setup.
