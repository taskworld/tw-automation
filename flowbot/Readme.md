## Github flow bot

In order to limit WIP (work-in-progress) for Taskworld development. Chris develop this aumation bot.

This bot will:
1. Close PR automatically after 14 days of inactive activity
2. Warn about old Pull request that have not been reviewed for a while

## Structure

- github.js ---> Deal with Github API
- taskworld.js ---> Deal with Taskworld API
- logic.js ---> All logic explanation (and test)
- report.js ---> Create nice message to paste in chat
- cli/run.js ---> Main runner