# Microservice-OrderService

This project is a microservice for order management that is part of a microservices architecture. The service handles the creation, retrieval, and management of customer orders, and is developed with Node.js for the backend.

# Features
- Create new orders for customers, including specifying products and quantities.
- Retrieve and list all customer orders.
- Integration with UserService to verify customer identity.
- Integration with ProductService to validate product availability.
- JWT-based authentication for secure access to order-related endpoints.

# Technologies Used
- Node.js - Backend runtime environment.
- Express - Framework for building RESTful APIs.
- Sequelize - ORM for interacting with a MySQL database.
- MySQL - Relational database used to store order details.
- JWT - Token-based authentication mechanism.
