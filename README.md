# TheBoilerplate Project Guide

This guide provides instructions for setting up and deploying TheBoilerplate project, which is a boilerplate for Next.js and Django projects using Docker.

---

## Initial Setup

### Prerequisites

- Docker and Docker Compose: [Installation Guide](https://docs.docker.com/get-docker/)
- Git: [Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Steps

1. **Clone the Repository**
    ```bash
    git clone https://github.com/tarikkavaz/TheBoilerplate.git
    cd TheBoilerplate
    ```

2. **Setup Frontend Environment Variables**
    ```bash
    cp frontend/.env-sample frontend/.env
    ```
    On the deployment server, it's crucial to update the variables with your respective values within the specified file.

    ```
    API_BASE_URL=YourServerIP
    API_PORT=8000
    CLIENT_BASE_URL=YourServerIP
    CLIENT_PORT=3000
    DOMAIN=YOURDOMAINNAME.com
    SERVER_PATH=/home/deployer/sites/YOURDOMAINNAME.com app path 
    SSH_ALIAS=YOURDOMAINNAME
    ```
    
    
    
3. **Install Frontend Dependencies and Build**
    ```bash
    (cd frontend && yarn)
    (cd frontend && yarn build)
    ```

4. **Build and Run Docker Containers**
    ```bash
    docker-compose up --build -d
    ```

5. **Initialize Django Database**
    ```bash
    docker-compose exec backend python manage.py migrate
    ```

6. **Load Sample Data (Optional)**
    ```bash
    docker-compose exec backend python manage.py loaddata datadump.json
    ```

7. **Create Django Superuser (Optional)**
    ```bash
    docker-compose exec backend python manage.py createsuperuser
    ```

8. **Stop the Docker**
    ```bash
    docker-compose down
    ```
---

## Development Setup

### Steps

1. **Build and Run Docker Containers**
    ```bash
    docker-compose up --build
    ```

2. **Access the Application**

    - Open [http://0.0.0.0:3000](http://0.0.0.0:3000) for the site. 
    - Open [http://0.0.0.0:8000/api](http://0.0.0.0:8000/api) for the API. 
    - Open [http://0.0.0.0:8000/admin](http://0.0.0.0:8000/admin) for the Django Admin Panel. 
    ( u:`admin` p:`boilerplate123` ) 

---

## Deployment Setup

### Prerequisites

- Ubuntu 20.04+ server
- SSH access to the server
- Domain name pointing to the server

### Steps

1. **Clone the Repository**
    ```bash
    git clone https://github.com/tarikkavaz/TheBoilerplate.git YOURDOMAINNAME
    cd YOURDOMAINNAME
    ```

2. **Setup Frontend Environment Variables**
    ```bash
    cp frontend/.env-sample-server frontend/.env
    ```
    Ensure that the values are correctly set.

2. **Setup Nginx file**
    ```bash
    cp nginx.conf-sample nginx.conf
    ```
    Ensure that the values `YOURDOMAINNAME` are correctly set.

4. **Run the Docker**
   
    ```bash
    docker-compose -f docker-compose.prod.yml up --build -d &&
    docker-compose exec backend python manage.py migrate &&
    docker-compose exec backend python manage.py loaddata datadump.json &&
    docker-compose exec backend python manage.py collectstatic
    ```

5. **Run the Deploy Script**

    First, ensure that your script is executable by running the following command:

    ```bash
    chmod +x deploy.sh
    ```

    Now, you can **deploy** your application using the following command:

    ```bash
    ./deploy.sh deploy
    ```

    If you wish to **prune** unused Docker objects during the deployment, you can use the following command instead:

    ```bash
    ./deploy.sh prune
    ```

    For other management tasks, you can use the script with different parameters as follows:

    To **dumpdata** data:
      ```bash
      ./deploy.sh dump
      ```

    To **load** data:
      ```bash
      ./deploy.sh load
      ```
