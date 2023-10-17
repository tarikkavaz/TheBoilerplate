# Local Setup
```bash
git clone https://github.com/tarikkavaz/TheBoilerplate.git &&
cd TheBoilerplate &&
cp frontend/.env-sample frontend/.env &&
(cd frontend && yarn) &&
(cd frontend && yarn build) &&
docker-compose up --build -d &&
docker-compose exec backend python manage.py migrate &&
docker-compose exec backend python manage.py loaddata datadump.json &&
docker-compose down
```

# Local Development Setup
```bash
docker-compose up --build
```
Stop the Development Server with Control-C.

# Server Buil Setup
```bash
docker-compose down &&
git pull &&
docker system prune -a -f &&
docker-compose -f docker-compose.prod.yml up --build -d &&
docker-compose exec backend python manage.py migrate &&
docker-compose exec backend python manage.py loaddata datadump.json &&
docker-compose exec backend python manage.py collectstatic
```