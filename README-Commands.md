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

# Local Development Server
```bash
docker-compose up --build
```
Stop the Development Server with Control-C.

Create data dump with auth.permission:
```bash
docker-compose exec backend python manage.py dumpdata >  backend/datadump.json
```
Create data dump without auth.permission:
```bash
docker-compose exec backend python manage.py dumpdata --exclude auth.permission >  backend/datadump.json
```

# Server Build

Go to the folder where the docker-compose.prod.yml file is located and run the following command:

```bash
docker-compose down --remove-orphans &&
git pull &&
docker system prune -a -f &&
docker-compose -f docker-compose.prod.yml up --build -d &&
docker-compose exec backend python manage.py migrate &&
docker-compose exec backend python manage.py loaddata /backend/datadump.json &&
docker-compose exec backend python manage.py collectstatic
```
