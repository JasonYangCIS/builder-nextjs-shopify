---
name: skill-creator
description: Meta-skill for authoring new .builder/skills entries.
---

When adding a new skill:

1. Create `.builder/skills/<name>/SKILL.md` with YAML front-matter (`name`, `description`) and a 5–10 line summary.
2. Create `docs/skills/<name>.md` with the long-form reference (single source of truth).
3. If the skill has matching code patterns, also add a `.builder/rules/<topic>.mdc` with `description`, `globs`, `alwaysApply: false`.
4. Update `AGENTS.md` "Project map + skill/rule index" to link the new skill.
