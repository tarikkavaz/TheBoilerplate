#!/bin/bash
source frontend/.env

ssh -T $SSH_ALIAS << ENDSSH_DUMP
  cd $SERVER_PATH
  docker-compose exec backend python manage.py dumpdata > datadump.json
ENDSSH_DUMP

scp $SSH_ALIAS:$SERVER_PATH/datadump.json backend/datadump.json

ssh -T $SSH_ALIAS << ENDSSH_DEPLOY
  cd $SERVER_PATH
  docker-compose down
  git pull
  docker system prune -a -f
  docker-compose -f docker-compose.prod.yml up --build -d
  docker-compose exec backend python manage.py migrate
  docker-compose exec backend python manage.py loaddata datadump.json
  docker-compose exec backend python manage.py collectstatic
ENDSSH_DEPLOY
