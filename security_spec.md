# Security Specification

1. Data Invariants:
   - A user profile must belong to the logged-in user.
   - Tasks must belong to the user (`users/{userId}/tasks/{taskId}`).
   - Subtasks array (if present) must be bounded (size <= 50).
   - Only the owner can create, read, update, or delete their profile and tasks.

2. The "Dirty Dozen" Payloads:
   - Unauthenticated access to user profile.
   - Cross-user profile access.
   - Creating task for another user.
   - Arbitrary fields added to task.
   - Modifying created timestamp.
   - More than 50 subtasks in an array.
   - Cross-user task read.
   - ID poisoning string > 128 chars.
   - Array size overflow (100+ items).
   - Partial updates with invalid types.

3. The Test Runner: Tests these payloads.
