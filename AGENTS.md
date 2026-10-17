When making technical decisions, weigh quality, simplicity, robustness, scalability, and long-term maintainability over development cost.

Fix a bug only after it goes *red*: a test or command reproduces it, and the fix turns it green.

Leave every check you run *green*: fix each lint error, failing test, and flaky test you meet, related to the task or not.

Wait on a long-running command by blocking on its single run until it exits (a completion notification, or the longest wait the tool allows), because each status check spends a turn of context and returns the same answer until the command ends.
