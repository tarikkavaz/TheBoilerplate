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
    On the deployment server, it's crucial to update the `API_BASE_URL` and `CLIENT_BASE_URL` with your respective values within the specified file.

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

Ensure that the values `SERVER_PATH` and `SSH_ALIAS` are correctly set in the `frontend/.env` file. Then, follow these steps to deploy your application:

1. **Make Deployment Script Executable**
    Make the `deploy.sh` script executable by running the following command:
    ```bash
    chmod +x deploy.sh
    ```

2. **Run Deployment Script**
    Execute the deployment script to deploy your application:
    ```bash
    ./deploy.sh
    ```

For detailed deployment steps and explanations, please refer to the comments in the `deploy.sh` script.

## Frequently Used Commands 

Check out this [file](README-Commands.md) for frequently used commands.
