# Flood-Cyclone-Prediction

This project focuses on cyclone and flood prediction using deep neural networks. It's a full-stack application with a React frontend and Node.js/Express backend.

## Project Structure

```
Flood-Cylone-Prediction/
├── backend/                 # Node.js/Express server
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
└── frontend/               # React application
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── hooks/          # Custom React hooks
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   └── utils/          # Utility functions
```

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/flood-cyclone-prediction
# For MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES=7d
BCRYPT_SALT_ROUNDS=12

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=http://localhost:3000

Create a `.env` file in the `frontend/` directory with the following variables:

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with the environment variables listed above

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with the environment variables listed above

4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Data
- `GET /api/data/health` - Health check
- `GET /api/data/predictions` - Get predictions (protected)
- `POST /api/data/predict` - Submit prediction request (protected)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Protected routes

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Express validator for input validation
- Helmet for security headers
- Morgan for logging

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- React Hook Form for form handling
- Tailwind CSS for styling
- React Hot Toast for notifications
- Lucide React for icons

## Development

### Running in Development Mode

1. Start MongoDB service
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm start`

### Production Build

1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Start production server:
   ```bash
   cd backend
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository.