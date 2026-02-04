# Build stage
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy maven wrapper and pom
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src src
RUN ./mvnw package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads/audio

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
