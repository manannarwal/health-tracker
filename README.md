# Health Tracker

A modern web application designed to centralize fragmented medical data, provide health trend analysis, and deliver actionable insights for better personal health management. The platform streamlines health monitoring by eliminating manual tracking inefficiencies and offering users a secure, intuitive, and responsive experience.


## Project Purpose

* **Problem Solved**

  * Health data is often fragmented across multiple healthcare providers.
  * Manual health tracking is inefficient and prone to errors.
  * Lack of a centralized platform makes it hard to monitor long-term health trends.

* **Solution**

  * A unified platform to securely store and track health metrics.
  * Automated data extraction from medical reports.
  * Interactive data visualizations for trend analysis.
  * Actionable insights for better personal health management.


## Core Technologies

* **Frontend:** React.js (Functional Components, Hooks, JSX), JavaScript, HTML5, CSS3
* **Styling & UI:** Tailwind CSS, Shadcn/ui, Radix UI Primitives, Lucide React Icons
* **Authentication & Security:** Google Identity Services, JWT Decode, OAuth 2.0, Protected Routes, LocalStorage
* **State Management:** React Context API, Custom Hooks, Component State
* **Build & Deployment:** Vite v6, ESLint, GitHub, Vercel
* **Development Tools:** VS Code, Git, npm, Modern JavaScript toolchain


## Key Features

### **Authentication & Security**
* Google OAuth 2.0 integration with one-click sign-in
* JWT token management with automatic refresh
* Protected routes with authentication guards
* Secure session persistence across browser sessions

### **Health Data Management**
* **Comprehensive Metrics Tracking:** Glucose, HbA1c, Cholesterol (Total, LDL, HDL, Triglycerides), Blood Pressure, Thyroid (TSH), Vitamins (D, B12, Folate), Liver Function, Kidney Function
* **Interactive Data Visualizations:** Charts and trend analysis
* **PDF Report Processing:** Upload and extract data from lab reports
* **Data Export:** Export health data for medical consultations

### **User Experience**
* **Dynamic Theming:** Dark/light mode with CSS custom properties
* **Responsive Design:** Mobile-first approach with cross-device compatibility
* **Accessibility:** WCAG compliant with keyboard navigation and screen reader support
* **Professional UI:** Clean, medical-grade interface design

### **APIs & Integrations**
* **Google Identity Services:** For OAuth 2.0 authentication
* **JWT Processing:** Client-side token validation and decoding
* **LocalStorage API:** Secure session persistence
* **File API:** PDF upload and processing capabilities
* **Responsive Design API:** CSS custom properties for theming

### **Performance & Technical**
* **Real-Time Updates:** Instant data synchronization across components
* **Optimized Builds:** Code splitting and lazy loading for fast load times
* **Error Handling:** Comprehensive error boundaries and user feedback
* **Progressive Web App:** Installable with offline capabilities


## Project Structure

```bash
health-tracker/
├── public/
│   └── favicon.png         # Custom Health Tracker favicon
├── src/
│   ├── assets/             # Images and static assets
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Shadcn/ui components (Button, Card, Dialog, etc.)
│   │   ├── Dashboard.jsx   # Main dashboard component
│   │   ├── Navbar.jsx      # Navigation with user profile
│   │   ├── ProfilePage.jsx # User profile management
│   │   ├── LoginPage.jsx   # Google OAuth login interface
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.jsx # Authentication state management
│   │   └── HealthDataContext.jsx # Health data state management
│   ├── lib/
│   │   └── utils.js        # Utility functions and helpers
│   ├── index.css           # Global styles with Tailwind imports
│   └── main.jsx            # Application entry point
├── .env                    # Environment variables (Google OAuth)
├── components.json         # Shadcn/ui configuration
├── eslint.config.js        # ESLint configuration
├── jsconfig.json           # JavaScript project configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```


## Installation & Setup

### Clone the repository

```bash
git clone https://github.com/manannarwal/health-tracker.git
cd health-tracker
```

### Install dependencies

```bash
npm install
```

### Setup environment variables

Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=your_backend_or_thirdparty_api
```

### Run the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```


## Future Enhancements

* Integration with **wearable devices (Fitbit, Apple Watch, etc.)**.
* AI-powered **health anomaly detection**.
* Doctor/patient **shared dashboards**.
* Multi-language support.
