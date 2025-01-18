# WTWR (What to Wear?): Back End

An express back-end project by Sam Branham

## Description

This server is intended to supply and handle the database for the What To Wear application.

Functionality:

- Create a MongoDB database for storing clothing items and users with schemas.
- Format routes for the API using multiple routers to keep code clean.
- Define controllers for the user and item databases that implement CRUD.
- Account managing with email and password hashing.
- Creates login tokens for controller authorization.
- Error catching and response.

## Tech stack

- Node and Express
- MongoDB connection and routing
- RESTful API format
- Bcrypt hashing and jsonwebtoken authorization
- Postman Testing
- ESLint configuration

## Deployment

`npm run start` — to launch the server
`npm run dev` — to launch the server with the hot reload feature
