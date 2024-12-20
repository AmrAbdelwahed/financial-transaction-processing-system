FROM openjdk:17-jre-slim

WORKDIR /app

COPY target/notification-service-0.0.1-SNAPSHOT.jar /app/notification-service.jar

CMD ["java", "-jar", "notification-service.jar"]
Docker Compose
docker-compose.yml


version: '3.8'

services:
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  kafka:
    image: wurstmeister/kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    depends_on:
      - zookeeper

  zookeeper:
    image: wurstmeister/zookeeper
    ports:
      - "2181:2181"

  user-service:
    build:
      context: ./user-service
      dockerfile: Dockerfile
    ports:
      - "8081:8081"
    depends_on:
      - mongo
      - kafka

  transaction-service:
    build:
      context: ./transaction-service
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    depends_on:
      - mongo
      - kafka

  notification-service:
    build:
      context: ./notification-service
      dockerfile: Dockerfile
    ports:
      - "8082:8082"
    depends_on:
      - kafka

volumes:
  mongo-data: