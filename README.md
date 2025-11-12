# Island Sun Tanning - Front-End

This is the front-end of the Island Sun Tanning web application, built with React. It provides a user-friendly interface for customers and administrators to interact with the tanning salon's services.

## Features

- **Customer Enrollment:** A digital form for new customers to sign up, including a digital signature pad for consent forms.
- **Customer Management:** View and manage a list of all customers with infinite scrolling.
- **Package Redemption:** A system for customers to redeem their tanning packages.
- **Tanning History:** Customers can view their past tanning sessions.
- **Admin Dashboard:** A central hub for administrators to manage the salon's operations.
- **Bed Management:** A dashboard to view and manage the status of tanning beds.
- **Secure Authentication:** User login and password reset functionality.
- **Responsive Design:** The application is designed to work on various screen sizes.

## Technologies Used

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A fast build tool for modern web development.
- **React Router:** For client-side routing and navigation.
- **Axios:** For making HTTP requests to the back-end API.
- **React Hot Toast:** For displaying notifications.
- **React Icons:** For including popular icons.
- **React Datepicker:** For selecting dates.
- **React Signature Canvas:** For capturing digital signatures.
- **ESLint:** For code linting and maintaining code quality.

## Getting Started

### Prerequisites

- Node.js and npm installed.
- The back-end server must be running.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd front-end
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally for preview.
