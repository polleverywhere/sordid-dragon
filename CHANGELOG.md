
## 2.0.1

- Patch release to fix bower version mismatch warning

## 2.0

- Remove IE8 & IE9 support
- Fix bug when sordidDragon is re-enabled during an in-progress drag
 - Add checks to ensure that we have started dragging before handling a move
 - Add removal of prior $placeholder and $ghost elements if a prior instance was actively dragging
 - This drops the previous drag at the spot it was at when the re-enable happened

## 1.x

Initial version(s), before changelog
