# angular-activity-logger
A daily habits/activities tracking web app built with Angular, MySQL and node.js.

Hosted on Heroku remote:
# https://angular-activity-logger.herokuapp.com/

# issues
The heroku MySQL plug-in kicks off the database connection before the Heroku Dyno runs SIGTERM, and the solution is to open a new connection. Unfortunately, the server code is currently built around a single shared connection on start-up and fixing the problem will mean refactoring a lot. As of this note (07/07) I haven't tried to fix it.
