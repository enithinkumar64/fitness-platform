<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project-specific development rules

Read `PROJECT.md` for the product vision, version scope, roadmap, definition of done, and completed and upcoming work.

1. Work on only one page or feature per task.
2. Never modify unrelated features without permission.
3. Explain changes in beginner-friendly language. The project owner has no coding experience.
4. Use the existing Next.js App Router, TypeScript, and Tailwind CSS setup.
5. Follow a consistent dark, premium design system.
6. Build reusable, accessible, mobile-first components.
7. Do not introduce paid APIs or services without approval. Core fitness tools must remain completely free.
8. Do not install packages unnecessarily. Prefer the existing tools and dependencies.
9. Never expose credentials or API keys in source code, browser output, logs, documentation, or Git history.
10. Test each completed application feature with the available lint, type-check, and build commands: `npm run lint`, `npx --no-install tsc --noEmit`, and `npm run build`. Do not install packages just to run checks. For documentation-only tasks, review the text, verify the changed-file scope, and check the diff instead of running application checks.
11. Report test results and any remaining problems, including checks that failed or could not run. Do not claim that an unperformed check passed.
12. Do not automatically commit or push changes to Git. Wait for an explicit user request.
13. Do not implement future roadmap features early. The roadmap documents plans, not permission to implement them.
14. Keep calculations transparent, testable, and appropriately qualified as estimates. Document formulas, units, assumptions, and limitations; validate inputs and check representative cases and edge cases. Do not present estimates as medical diagnoses or guaranteed outcomes.
