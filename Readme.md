# Learn Code Anywhere (LCA)

## Project Overview

Learn Code Anywhere (LCA) is a comprehensive platform designed to facilitate learning and sharing of coding knowledge. It includes a backend API and a frontend web application, enabling users to upload, share, and discover coding-related videos and resources.

## Features

### Backend

- **Authentication**: Secure user authentication and authorization.
- **Video Management**: Upload, categorize, and manage video content.
- **Payment Integration**: Razorpay integration for handling payments.
- **Coupon System**: Apply discounts using coupon codes.
- **Wallet System**: Manage user wallets for transactions.
- **Swagger API Documentation**: Interactive API documentation available at `/api-docs`.

### Frontend

- **Responsive Design**: Built with React and Tailwind CSS for a seamless user experience.
- **Video Discovery**: Explore and watch videos through a user-friendly interface.
- **Admin Dashboard**: Manage platform content and users.

## Technologies Used

### Backend

- **Node.js**
- **TypeScript**
- **Prisma**
- **Express.js**
- **Razorpay SDK**

### Frontend

- **React**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **shadcn-ui**

## Setup Instructions

### Prerequisites

- Node.js and npm installed ([Install Node.js](https://nodejs.org/))
- pnpm package manager ([Install pnpm](https://pnpm.io/installation))

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up the database:
   ```bash
   pnpm prisma migrate dev
   ```
4. Start the backend server:
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. Navigate to the `learn-code-anywhere` directory:
   ```bash
   cd learn-code-anywhere
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```

## Deployment

To deploy the project, follow the steps outlined in the [Lovable Documentation](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
