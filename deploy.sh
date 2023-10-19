#!/bin/bash

# Load the .env file
source frontend/.env

# Use the values from .env
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
