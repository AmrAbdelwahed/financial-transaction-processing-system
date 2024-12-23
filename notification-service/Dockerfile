# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven project files (pom.xml and src directory) into the container
COPY pom.xml ./
COPY src ./src

# Build the project and create the JAR file
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM openjdk:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8082

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
