#!/bin/bash
source frontend/.env

ssh_exec() {
    ssh -T $SSH_ALIAS << ENDSSH
        cd $SERVER_PATH
        $1
ENDSSH
}

docker_commands() {
    echo "
        docker-compose -f docker-compose.prod.yml up --build -d
        docker-compose exec backend python manage.py migrate
        docker-compose exec backend python manage.py loaddata datadump.json
        docker-compose exec backend python manage.py collectstatic
    "
}

prepare_deploy() {
    echo "
        docker-compose down --remove-orphans
        git pull
    "
}

action=$1

case $action in
  dump)
    ssh_exec "docker-compose exec backend python manage.py dumpdata > datadump.json"
    scp $SSH_ALIAS:$SERVER_PATH/datadump.json backend/datadump.json
    ;;
  deploy)
    commands="
        $(prepare_deploy)
        $(docker_commands)
    "
    ssh_exec "$commands"
    ;;
  prune)
    commands="
        $(prepare_deploy)
        docker system prune -a -f
        $(docker_commands)
    "
    ssh_exec "$commands"
    ;;
  load)
    ssh_exec "docker-compose exec backend python manage.py loaddata datadump.json"
    ;;
  *)
    echo "Invalid action. Use 'dump', 'deploy', 'prune', or 'load'."
    ;;
esac
