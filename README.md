# ZapMate - A Zapier Clone

https://github.com/user-attachments/assets/236829e2-d6c6-4c6e-b83d-71b20aab4392

ZapMate is a robust clone of Zapier, designed to automate workflows and integrate multiple services seamlessly. This project demonstrates a microservices architecture with cutting-edge technologies for high performance, scalability, and efficient load management.

## Features

- Workflow automation across multiple applications
- Microservices architecture for modular development
- Kafka for efficient load management and communication between services
- PostgreSQL as the primary database
- TurboRepo for managing shared configurations and packages
- Email notification functionality
- Easy deployment and scalable architecture

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: Next.js
- **Database**: PostgreSQL
- **Messaging**: Kafka
- **Monorepo Management**: TurboRepo
- **Other Utilities**: Shared configurations for database, Kafka, and email sender

## Project Structure

The project is organized as a monorepo using TurboRepo, enabling shared configurations across services. Below is an overview of the structure:

```plaintext
root/
├── apps/
│   ├── server/      # Node.js + Express backend for creating users and zaps
│   ├── web/         # Next.js frontend
│   ├── hooks/       # Node.js + Express backend for handling hooks triggered by any external trigger
│   ├── processor/   # Node.js microservice for implementing transactional outbox pattern
│   ├── worker/      # Node.js microservices to pick individual actions in zap, and put the next action in kafka if required.
├── packages/
│   ├── db-config/    # Shared database configurations
│   ├── kafka-config/ # Kafka producer/consumer configurations
│   ├── email-sender/ # Shared email utilities
└── README.md
