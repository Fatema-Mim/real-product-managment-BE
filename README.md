# Product API Management

Backend server built with Node.js, Express, and TypeScript .

## Tech

- Node.js
- Express.js
- TypeScript
- JSON Web Token (JWT)
- Cookie Parser
- CORS
- Dotenv
- Firebase admin

## Project Structure

```
backend/
├── src/
│   ├── config/                      # Configuration files
│   │   ├── firebase.ts              # Firebase Admin SDK setup
│   │   └── upload.ts                # Multer file upload config
│   ├── controllers/                 # Request handlers
│   │   ├── auth.controller.ts       # Login/logout handlers
│   │   ├── product.controller.ts    # Product CRUD handlers
│   │   └── category.controller.ts   # Category CRUD handlers
│   ├── services/                    # Business logic layer
│   │   ├── auth.service.ts          # Authentication logic
│   │   ├── product.service.ts       # Product Firebase operations
│   │   └── category.service.ts      # Category Firebase operations
│   ├── middleware/                  # Express middlewares
│   │   ├── auth.ts                  # JWT authentication
│   │   ├── validation.ts            # Input validation
│   │   └── upload-error-handler.ts  # File upload error handling
│   ├── routes/                      # API route definitions
│   │   ├── auth.ts                  # Auth routes
│   │   ├── products.ts              # Product routes
│   │   └── categories.ts            # Category routes
│   ├── utils/                       # Utility functions
│   │   ├── response-handler.ts      # Response helpers
│   │   └── custom-errors.ts         # Custom error classes
│   ├── types/                       # TypeScript type definitions
│   │   ├── index.d.ts               # Global types
│   │   ├── product.ts               # Product interface
│   │   └── category.ts              # Category interface
│   ├── data/                        # Mock data
│   │   └── users.ts                 # Demo user credentials
│   └── index.ts                     # Main server file
├── uploads/                         # Uploaded product images
├── .env                             # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Folder Structure

### `/config` - Configuration Files
- **firebase.ts**: Firebase Admin SDK initialization and Firestore setup
- **upload.ts**: Multer configuration for file uploads (10MB limit, JPG/PNG only)

### `/controllers` - Request Handlers
- **auth.controller.ts**: Login and logout handlers
- **product.controller.ts**: Product CRUD operations 
- **category.controller.ts**: Category CRUD operations

### `/services` - Business Logic Layer
- **auth.service.ts**: User authentication and JWT token generation
- **product.service.ts**: Firebase Firestore operations for products
- **category.service.ts**: Firebase Firestore operations for categories

### `/middleware` - Express Middlewares
- **auth.ts**: JWT token verification from cookies
- **validation.ts**: Request data validation (login input)
- **upload-error-handler.ts**: Multer error handling (file size, type validation)

### `/routes` - API Route Definitions
- **auth.ts**: Authentication routes (/login, /logout)
- **products.ts**: Product routes (CRUD with file upload)
- **categories.ts**: Category routes (CRUD)

### `/utils` - Utility Functions
- **response-handler.ts**: Standardized API response helpers (success, error, notFound)
- **custom-errors.ts**: Custom error classes (ValidationError, AuthenticationError, NotFoundError, DatabaseError)

### `/types` - TypeScript Type Definitions
- **index.d.ts**: Global type definitions (AuthRequest interface)
- **product.ts**: Product interface
- **category.ts**: Category interface

### `/data` - Mock Data
- **users.ts**: Demo user credentials for authentication

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file:


Update the variables:

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=your-jwt-secret-key-here
JWT_EXPIRES_IN=add time
FRONTEND_ORIGIN=http://localhost:3000
```

## Available Scripts

### Development Mode
```bash
npm run dev
```
Runs with auto-reload using ts-node-dev

### Build for Production
```bash
npm run build
```
Compiles TypeScript to JavaScript in `dist/`

### Start Production Server
```bash
npm start
```
Runs compiled code from `dist/`

## API Endpoints

### Health Check
- **GET** `/`
  - Returns: "Backend working perfectly!"

### Authentication Routes

#### Login
- **POST** `/api/auth/login`
- Validation: Username and password required
- Body:
  ```json
  {
    "username": "demo",
    "password": "demo123"
  }
  ```
- Response:
  ```json
  {
    "message": "Login successful"
  }
  ```

#### Logout
- **POST** `/api/auth/logout`
- Response:
  ```json
  {
    "message": "Logout successful"
  }
  ```

### Product Routes (All require authentication)

#### Add Product
- **POST** `/api/products/add`

#### Get All Products
- **GET** `/api/products`

#### Get Product by ID
- **GET** `/api/products/:id`


#### Update Product
- **PUT** `/api/products/:id`

#### Delete Product
- **DELETE** `/api/products/:id`


## Default Credentials

- Username: `demo`
- Password: `demo123`

## Features

- TypeScript for type safety
- JWT authentication with cookie-based sessions
- Request validation middleware
- Global error handling
- Real time data storage (no database required)
- CORS enabled for frontend communication
- Environment based configuration
- No comments

## Error Handling

The application includes:
- Global error handler middleware
- 404 route not found handler
- Validation error responses
- Authentication error responses

## Development

Server runs on `http://localhost:4000` by default.
All routes except `/` and `/api/auth/login` require authentication.
