---
trigger: always_on
---

# Workflow Rules

## Implementation Plan Requirements

- **Branch and PR Strategy**: Every implementation plan must explicitly include a step to create a new branch and open a Pull Request (PR) using the GitHub CLI (`gh`) BEFORE starting any coding work.

## Task/Todo List Requirements

- **Atomic Commits**: The todo list must always include specific steps to commit changes.
- **Commit Trigger**: Whenever a meaningful unit of work (component, feature, fix) is ready, a commit step must be executed immediately.
