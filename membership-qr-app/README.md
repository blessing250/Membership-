# Membership QR Code App

A React web application for managing gym/spa memberships using QR codes for verification.

## Features

- User registration and authentication
- QR code generation for each member
- Admin dashboard for scanning and verifying QR codes
- Membership status management
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/membership-qr-app.git
cd membership-qr-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and add your configuration:
   - Go to the Firebase Console
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase configuration

4. Create a `.env` file in the root directory and add your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm start
```

## Usage

### For Members
1. Register an account
2. Log in to view your QR code
3. Show your QR code to the administrator for verification

### For Administrators
1. Log in to the admin dashboard
2. Use the QR code scanner to verify member status
3. Approve or manage memberships as needed

## Technologies Used

- React
- Firebase Authentication
- Firebase Firestore
- Tailwind CSS
- QR Code Generation
- QR Code Scanning

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
