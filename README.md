## Assignment: Graphql

Added logic to the graphql endpoint: ***./src/routes/graphql***.  
Constraints and logic for gql queries should be done based on restful implementation.  
   1. Implemented configuration of queries and mutations. You can check this by running ***npm run test-queries*** и ***npm run test-mutations***
   2. Implemented limiting the complexity of Graphql queries based on their depth. You can check this by running ***npm run test-rule***


Steps to get started:
1. Switch to branch develop
2. Install dependencies: npm ci
3. Create .env file (based on .env.example): ./.env
4. Create db file: ./prisma/database.db
5. Apply pending migrations: npx prisma migrate deploy
6. Seed db: npx prisma db seed
7. Start server: npm run start