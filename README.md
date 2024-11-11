1. Create Prisma ORM DB access in a common packages module ✅
2. Add zod data validations for db that can be used in hooks, processor and other backend services

3. Hooks service will fetch any actions from external applications, and will add them to the Database
    Implement a transactional outbox pattern for hooks to store in databases ✅
4. Kafka setup on common packages module that can be shared between processor and servers
