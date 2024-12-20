# financial-transaction-processing-system

## Overview
The Financial Transaction Processing System is a microservices-based application designed to handle financial transactions, manage user data, and send notifications. It uses Spring Boot for the backend services, Docker for containerization, Kafka for event-driven communication, MongoDB for the database, and React for the frontend.

## Components
- **User Service**: Manages user data and authentication.
- **Transaction Service**: Processes financial transactions.
- **Notification Service**: Sends notifications based on transactions and user events.
- **Frontend**: A React-based web application to interact with the backend services.

## Prerequisites
- Docker
- Docker Compose
- Maven
- Node.js

## Setup

### Backend

1. **Build the Services:**
   ```bash
   cd user-service
   mvn clean install
   cd ../transaction-service
   mvn clean install
   cd ../notification-service
   mvn clean install
