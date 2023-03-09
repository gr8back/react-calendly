#! /bin/bash
set -m

nodemon express-server.js &
cd reactcalendly && npm run build && fg
