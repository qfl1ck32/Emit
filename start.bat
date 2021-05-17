start "Redis" backEnd/redis/redis-server.exe
start cmd /k "cd backEnd && nodemon server.ts"
start cmd /k "cd backEnd && nodemon authServer.ts"
start cmd /k "cd frontEnd && expo start"
