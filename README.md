# User Management System - Backend

A simple backend API for user management using **Node.js**, **Express.js**, and **MongoDB**.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a cloud-based database)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <project_directory>

2. **Install dependencies:**
    npm install

3. **Create a .env file in the root directory and add the following:**
    MONGO_URI=mongodb://localhost:27017/user-management  # MongoDB connection string
    JWT_SECRET=your_jwt_secret_key  # Secret key for JWT generation

4. **Run the application:**
    npm start

**API Endpoints**
POST /api/users: Register a new user.
POST /api/login: Login a user and get a JWT.
GET /api/users: Retrieve users with pagination and filters.
PUT /api/users/:id: Update user information.