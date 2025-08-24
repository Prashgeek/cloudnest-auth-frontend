 ##Tech Stack#########################################################################################################################################################################

React 18

Vite for build & dev server

React Router v7 for routing

Tailwind CSS v3 for utility-first styling

Framer Motion for animations

Lucide React icons

Sonner for toast notifications

React Hook Form (for form state)

Zod (for schema validation)

@react-three/fiber + drei for optional 3D background

clsx for conditional class names

 ######Project Structure###########################################################################################################################################################
text
src/
├── App.jsx              # Main app & routing
├── main.jsx             # ReactDOM render
├── index.css            # Tailwind imports & global styles
├── pages/
│    AuthPage.jsx     # Renders login/signup/forgot/reset forms
│   
├── components/
│   ├── LoginForm.jsx
│   ├── SignupForm.jsx
│   ├── ForgotPasswordForm.jsx
│   ├── ResetPasswordForm.jsx
│   ├── InputField.jsx
│   ├── Button.jsx
│   └── MarketingSection.jsx
├── hooks/                # (Optional) custom hooks
├── utils/                # Validation schemas, helpers
└── assets/               # Images, icons
 
##Authentication Flows##########################################################################################################################################################
Login
Component: LoginForm.jsx

Route: /auth with mode="login"

Backend: POST /api/auth/login with { email, password } → returns JWT.

On Success: store token (e.g., localStorage) and redirect to dashboard.

Signup
Component: SignupForm.jsx

Route: /auth with mode="signup"

Backend: POST /api/auth/signup with { name, email, password } → returns user.

On Success: redirect to /auth?mode=login.

Forgot Password
Component: ForgotPasswordForm.jsx

Route: /auth with mode="forgot"

Backend: POST /api/auth/forgot-password with { email } → sends reset email.

On Success: navigate to /reset-password?token=<fake>.

Reset Password
Component: ResetPasswordForm.jsx

Route: /reset-password?token=...

Backend: POST /api/auth/reset-password with { token, newPassword } → updates password.

On Success: redirect to /auth.

 ###Backend Integration Points#########################################################################################################################################################
Base URL & Endpoints

Configure in src/utils/api.js (create file) or use import.meta.env.VITE_API_URL.

Login

js
await fetch(`${API_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
Signup

js
await fetch(`${API_URL}/auth/signup`, { method: 'POST', body: JSON.stringify({ name, email, password }) });
Forgot Password

js
await fetch(`${API_URL}/auth/forgot-password`, { method: 'POST', body: JSON.stringify({ email }) });
Reset Password

js
await fetch(`${API_URL}/auth/reset-password`, { method: 'POST', body: JSON.stringify({ token, newPassword }) });
Replace simulated API calls in form components with real fetch or Axios calls, handling success and error responses accordingly.


######Component Library & Conventions
InputField.jsx: Labeled input with icon, error display.

Button.jsx: Supports loading, variant, and rightIcon.

Animation: All forms wrap in <motion.div> for enter/exit transitions.

Naming: Components are PascalCase. Hooks and utils are camelCase.

#########Styling & Theming#################################################################################################################################################################
Tailwind Config (tailwind.config.js):

darkMode: ["class"]

Custom colors: brand palette

Global (index.css): imports Tailwind directives and form helper classes.

Toggle dark mode by adding/removing class="dark" on <html>.

######Environment Variables#############################################################################################################################################################
Create a .env file at project root:

text
VITE_API_URL=https://api.cloudnest.com
Access via import.meta.env.VITE_API_URL. 

#########Running & Building################################################################################################################################################################
Install dependencies: npm install

Development server: npm run dev

Production build: npm run build

Preview build: npm run preview

################# Contributing & Next Steps############################################################################################################################################
Frontend Partners:

Reuse AuthPage routing and UI components.

Add new pages under src/pages, update App.jsx routes.

Backend Developers:

Implement auth endpoints matching above integration points.

Ensure CORS allows requests from the frontend’s origin.

Future Features:

Dashboard at /dashboard, reuse theme and navigation.

Profile editing, 2FA, social logins.

For any questions, refer to component code comments or follow the same conventions when adding new features.

i need its all pdf

i need its all pdf
A PDF export isn’t directly supported here, but you can generate a markdown file and convert it to PDF locally. Here’s the complete README in markdown format:

text
# Cloudnest Authentication Frontend

A React + Vite application that provides authentication flows for Cloudnest, including login, signup, forgot password, and reset password pages.

## Table of Contents

1. [Introduction](#introduction)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)  
4. [Authentication Flows](#authentication-flows)  
5. [Backend Integration Points](#backend-integration-points)  
6. [Component Library & Conventions](#component-library--conventions)  
7. [Styling & Theming](#styling--theming)  
8. [Environment Variables](#environment-variables)  
9. [Running & Building](#running--building)  
10. [Contributing & Next Steps](#contributing--next-steps)  

## Introduction

Cloudnest Authentication Frontend is a modular React application bootstrapped with Vite. It handles user authentication flows and provides reusable components for forms, buttons, and UI elements.

## Tech Stack

- React 18  
- Vite  
- React Router v7  
- Tailwind CSS v3  
- Framer Motion  
- Lucide React  
- Sonner  
- React Hook Form  
- Zod  

## Project Structure

src/
├── App.jsx
├── main.jsx
├── index.css
├── pages/
│ ├── AuthPage.jsx
│ └── ResetPasswordPage.jsx
├── components/
│ ├── LoginForm.jsx
│ ├── SignupForm.jsx
│ ├── ForgotPasswordForm.jsx
│ ├── ResetPasswordForm.jsx
│ ├── InputField.jsx
│ └── Button.jsx
├── hooks/
├── utils/
└── assets/

text

## Authentication Flows

- **Login**: POST `/api/auth/login` → JWT, then redirect to dashboard.  
- **Signup**: POST `/api/auth/signup` → redirect to login.  
- **Forgot Password**: POST `/api/auth/forgot-password` → email link.  
- **Reset Password**: POST `/api/auth/reset-password` → redirect to login.

## Backend Integration Points

Configure your API URL in an environment variable (`VITE_API_URL`) and use it in fetch/Axios calls:

const API_URL = import.meta.env.VITE_API_URL;
await fetch(${API_URL}/auth/login, { method: 'POST', body: JSON.stringify({ email, password }) });

text

Repeat similarly for signup, forgot-password, and reset-password endpoints.

## Component Library & Conventions

- `InputField`: Labeled input with icon and error.  
- `Button`: Supports `loading`, `variant`, `rightIcon`.  
- Animations via `<motion.div>`.  
- PascalCase component names.

## Styling & Theming

- Dark mode via `class="dark"` on `<html>`.  
- Custom brand colors in `tailwind.config.js`.  
- Global styles in `index.css`.

## Environment Variables

Create `.env`:

VITE_API_URL=https://api.cloudnest.com

text

## Running & Building

npm install
npm run dev # Start dev server

text

## Contributing & Next Steps

- **Frontend Partners**: Add new features under `src/pages`, update `App.jsx` routes.  
- **Backend Developers**: Implement matching API endpoints, configure CORS.  
