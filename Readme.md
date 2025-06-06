# DuoShop - Expense Tracker App

A modern, user-friendly mobile application for tracking personal expenses and income. Built with React Native and Expo.

## Features

- 💰 **Track expenses and income** with categories
- 📊 **View financial summaries** with balance, income, and expense totals
- 🗓️ **Transaction history** with ability to filter and search
- 🔍 **Detailed transaction view** with category icons
- 🌙 **Beautiful UI design** with smooth gradients and animations
- 👤 **User authentication** powered by Clerk

## Tech Stack

- **Frontend**: React Native, Expo Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Neon
- **Authentication**: Clerk
- **Styling**: React Native StyleSheet
- **Icons**: Ionicons
- **UI Elements**: Linear Gradient, Custom Components

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- PostgreSQL database

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/duoshop.git
cd duoshop
```

2. Install dependencies for mobile app
```bash
cd mobile
npm install
```

3. Install dependencies for backend
```bash
cd ../backend
npm install
```

4. Configure environment variables
   - Create a `.env` file in the backend directory
   - Create a `constants/API.js` file in the mobile directory

5. Start the backend server
```bash
cd backend
npm start
```

6. Start the Expo development server
```bash
cd mobile
npx expo start
```

## Project Structure

```
duoshop/
├── mobile/                  # Mobile app (React Native/Expo)
│   ├── app/                 # Main application code
│   │   ├── (root)/          # Root routes
│   │   │   ├── index.jsx    # Home screen
│   │   │   ├── create.jsx   # Create transaction screen
│   │   │   └── profile.jsx  # User profile screen
│   │   └── hooks/           # Custom React hooks
│   ├── components/          # Reusable components
│   ├── constants/           # Constants and configuration
│   └── assets/              # Images, styles, and other assets
└── backend/                 # Backend API
    ├── src/
    │   ├── controllers/     # Route controllers
    │   ├── routes/          # API routes
    │   ├── config/          # Configuration files
    │   └── models/          # Database models
    ├── .env                 # Environment variables
    └── index.js             # Entry point
```

## API Endpoints

- `GET /api/transactions/:userId` - Get all transactions for a user
- `GET /api/transactions/summary/:userId` - Get summary statistics for user
- `POST /api/transactions` - Create a new transaction
- `DELETE /api/transactions/:id` - Delete a transaction

## Contributors

- Your Name (github.com/yourusername)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created with ❤️ using React Native & Expo