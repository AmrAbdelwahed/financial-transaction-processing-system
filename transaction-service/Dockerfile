FROM openjdk:17-jre-slim

WORKDIR /app

COPY target/transaction-service-0.0.1-SNAPSHOT.jar /app/transaction-service.jar

CMD ["java", "-jar", "transaction-service.jar"]