# Reading Recommendation System

This project demonstrates how to run a [NestJS](https://nestjs.com/) application with Docker Compose and configure environment variables using an `.env` file.

## Prerequisites

- Docker
- Docker Compose

Ensure you have Docker and Docker Compose installed on your machine. You can check the installation by running:

```bash
docker --version
docker-compose --version
```

## Project Setup

1. Clone this repository:

    ```bash
    git clone https://github.com/ahmedmustafamo/reading-recommendation-system-api.git
    cd reading-recommendation-system-api
    ```

2. Run the Docker images (app and db) and start the application using Docker Compose:

    ```bash
    docker-compose up
    ```

## Environment Variables

Before running the application, make sure to configure your environment variables by creating a `.env` file in the root directory of the project.

### Sample `.env`

```env
# .env file
DB_HOST=rrs-db
DB_PORT=5432
POSTGRES_USER=db_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=reading_recommendation
JWT_SECRET=mysecretkey123456
JWT_SECRET_EXPIRATION=3600s
SUPER_ADMIN_EMAIL=admin@email.com
SUPER_ADMIN_PASSWORD=P@ssw0rd
NODE_ENV=development
```

> Ensure you replace these values with the actual settings for your environment.

## Docker Compose Setup

1. Build and start the application:

    ```bash
    docker-compose up
    ```

   This will build the Docker image for your NestJS app and start all the necessary services.

2. Access the application:

    After the containers are up, your NestJS app should be available at:

    ```bash
    http://localhost:3000
    ```

## Running Unit Test Cases

Before running the unit tests, make sure you have started the application using Docker Compose, as the tests may depend on the running services (e.g., database or other dependencies).

1. **Ensure Docker Compose is running**:

    Make sure you've started the application using:

    ```bash
    docker-compose up
    ```

2. **Run Unit Tests**:

    Once the Docker Compose services are running, you can run the unit tests for the NestJS application with the following command:

    ```bash
    docker exec -it rrs-app npm run test
    ```

    This will execute the unit tests inside the running `rrs-app` container.

## File Structure

- **`src/`**: Source code for the NestJS application.
- **`.env`**: Environment variables for configuration (make sure to create one).
- **`Dockerfile`**: Dockerfile to build the NestJS application container.
- **`docker-compose.yml`**: Docker Compose configuration file to run the app with dependencies.

## Docker Compose Services

This project includes the following services:

- **rrs-app**: The NestJS application itself.
- **rrs-db**: A PostgreSQL database.

## Stopping the Application

To stop the application and remove the containers, run:

```bash
docker-compose down
```

This will stop and remove the containers, networks, and volumes defined in the `docker-compose.yml` file.

## Troubleshooting

- If you experience issues with Docker not finding the `.env` file, make sure it is properly created in the root directory.
- Check Docker logs for errors by running:

    ```bash
    docker-compose logs
    ```
