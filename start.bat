start "Redis" backEnd/redis/redis-server.exe
start cmd /k "cd backEnd && tsc -w"
start cmd /k "cd backEnd && nodemon -q -w dist dist/app.js"
start cmd /k "cd frontEnd && expo start"
