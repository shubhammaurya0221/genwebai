# Website Builder

## Overview
The Website Builder project is a MERN stack application designed to allow users to create, edit, and manage websites easily. It provides a user-friendly interface for building websites without requiring extensive coding knowledge. The platform includes features such as live site previews, pricing plans, and user authentication.

## Tech Stack
- **Frontend**: React, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: Redux Toolkit
- **Authentication**: Firebase
- **Payment Integration**: Razorpay

## Features
- User authentication and authorization
- Drag-and-drop website editor
- Live site preview functionality
- Pricing plans for different user tiers
- Payment gateway integration with Razorpay
- Dashboard for managing user websites
- Responsive design for mobile and desktop

## Packages Used
### Frontend
- `react`: For building the user interface
- `reduxjs/toolkit`: For state management
- `firebase`: For authentication
- `vite`: For fast development and build

### Backend
- `express`: For building the server
- `mongoose`: For interacting with MongoDB
- `razorpay`: For payment gateway integration
- `dotenv`: For managing environment variables

## Errors Encountered and Solutions
### Error 1: CORS Policy Issue
- **Problem**: The frontend was unable to communicate with the backend due to CORS restrictions.
- **Solution**: Added the `cors` middleware in the backend to allow cross-origin requests.

### Error 2: Firebase Authentication Token Expiry
- **Problem**: Users were logged out unexpectedly due to expired Firebase tokens.
- **Solution**: Implemented token refresh logic using Firebase SDK.

### Error 3: MongoDB Connection Timeout
- **Problem**: The backend occasionally failed to connect to the MongoDB database.
- **Solution**: Optimized the database connection logic and ensured proper environment variable configuration.

### Error 4: Razorpay Webhook Signature Verification
- **Problem**: Webhook requests from Razorpay failed due to signature mismatch.
- **Solution**: Correctly implemented signature verification using the Razorpay SDK.

## Conclusion
The Website Builder project demonstrates the power of the MERN stack in creating dynamic and user-friendly web applications. By leveraging modern tools and frameworks, the project provides a robust platform for users to build and manage their websites efficiently. The challenges faced during development were resolved through careful debugging and the use of best practices, ensuring a smooth user experience.

---

This README serves as a comprehensive guide to the project, highlighting its purpose, technologies, and the solutions implemented to overcome development challenges.
