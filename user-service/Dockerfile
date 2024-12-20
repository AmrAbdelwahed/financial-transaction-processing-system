# Use Java 17 runtime image
FROM openjdk:17-jre-slim

# Set working directory in the container
WORKDIR /app

# Copy the JAR file from the target directory
COPY target/user-service-0.0.1-SNAPSHOT.jar /app/user-service.jar

# Command to run the application
CMD ["java", "-jar", "user-service.jar"]
