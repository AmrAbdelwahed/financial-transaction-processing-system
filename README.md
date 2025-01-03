# financial-transaction-processing-system

## Overview
The Financial Transaction Processing System is a microservices-based application designed to handle financial transactions, manage user data, and send notifications. It uses Spring Boot for the backend services, Docker for containerization, Kafka for event-driven communication, MongoDB for the database, and React for the frontend.

## Components
- **User Service**: Manages user data and authentication.
- **Transaction Service**: Processes financial transactions.
- **Notification Service**: Consumer - Sends email notifications based on transactions and user events.
- **Frontend**: A React-based web application to interact with the backend services.

## Deployment

The application is now deployed in a Dockerized environment and can be accessed via the following URL:


**[Financial Transaction Processing System](https://streamlinepay.up.railway.app/)**

This deployment includes both the frontend and backend services, providing full functionality.


## Optional: Running the Application Locally with Docker

If you prefer to run the application locally using Docker and Docker Compose, follow these steps:

### Prerequisites
- Docker (optional)
- Docker Compose (optional)

### Steps to Run Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/financial-transaction-processing-system.git
   cd financial-transaction-processing-system

2. **Build and run the services:**
   ```bash
   docker-compose up --build

3. **Access the Application:**
- Frontend: http://localhost:3000
- User Service API: http://localhost:8081/api/users
- Transaction Service API: http://localhost:8085/api/transactions
- Notification Service API: http://localhost:8082

## Notes (If running locally)

- The Docker Compose file will handle building the services and starting dependent containers like MongoDB, Kafka, and Zookeeper.
- MongoDB data will be persisted in a volume called mongo-data.
- Kafka topics (users and transactions) will be automatically created.

## Directory Structure
   ```text
   financial-transaction-processing-system/
   │
   ├── user-service/            # User Service source code
   │   ├── src/
   │   └── Dockerfile           # Dockerfile for User Service
   │
   ├── transaction-service/     # Transaction Service source code
   │   ├── src/
   │   └── Dockerfile           # Dockerfile for Transaction Service
   │
   ├── notification-service/    # Notification Service source code
   │   ├── src/
   │   └── Dockerfile           # Dockerfile for Notification Service
   │
   ├── frontend/                # React-based Frontend source code
   │   ├── src/
   │   └── Dockerfile           # Dockerfile for Frontend
   │
   ├── docker-compose.yml       # Orchestrates all services
   └── README.md                # Project documentation
   ```

## Troubleshooting

- Use the following command to stop all running containers:
   ```bash
   docker-compose down

- Check the logs for any errors:
   ```bash
   docker-compose logs

