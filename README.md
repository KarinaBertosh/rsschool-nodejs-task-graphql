## Assignment: Graphql

Added logic to the graphql endpoint: **_./src/routes/graphql_**.  
Constraints and logic for gql queries should be done based on restful implementation.

1.  Implemented configuration of queries and mutations. You can check this by running **_npm run test-queries_** и **_npm run test-mutations_**
2.  Implemented limiting the complexity of Graphql queries based on their depth. You can check this by running **_npm run test-rule_**

Steps to get started:

1. Switch to branch develop
2. Install dependencies: npm install -D typescript ts-node @types/node
3. Install dependencies: npm i
4. Create .env file (based on .env.example): ./.env
5. Create db file: ./prisma/database.db
6. Apply pending migrations: npx prisma migrate deploy
7. Seed db: npx prisma db seed
8. Start server: npm run start
