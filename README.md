# Admin Dashboard with Role-Based Access Control (RBAC)

A modern, responsive full-stack admin dashboard built with Next.js, Express.js, and MongoDB that implements role-based access control with different user roles (admin, editor, viewer) and their respective permissions.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication system with secure token management
- Role-based access control (RBAC) with granular permissions
- Protected routes for both API and frontend
- Secure password hashing with bcrypt
- Automatic token refresh and session management

### 👥 User Management (Admin Only)
- View all users with responsive table and mobile-friendly cards
- Edit user roles (admin, editor, viewer) with intuitive modal interface
- Activate/deactivate user accounts
- Delete user accounts with confirmation
- User statistics and overview dashboard

### 📝 Content Management (Admin & Editor)
- Create, edit, and delete posts and comments
- Content status management (draft, published, archived)
- Content filtering and search capabilities
- Content statistics and analytics
- Viewer role can access read-only content library

### 📊 Activity Logs (Admin Only)
- Comprehensive system activity tracking
- View logs by user, action type, and date range
- Responsive log display with mobile-optimized cards
- Activity statistics and analytics
- Pagination for large datasets

### 🎨 Modern Responsive UI/UX
- **Mobile-First Design**: Fully responsive across all devices
- **Component Architecture**: Reusable, modular components
- **Tailwind CSS**: Modern styling with utility classes
- **Role-based Navigation**: Dynamic sidebar with mobile toggle
- **Real-time Notifications**: Toast messages for user feedback
- **Accessibility**: Proper contrast, focus states, and screen reader support
- **Touch-Friendly**: Optimized for mobile and tablet interactions

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form handling with validation
- **Axios** - HTTP client with interceptors
- **Lucide React** - Beautiful, customizable icons
- **React Hot Toast** - Elegant notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing and verification
- **Express Validator** - Input validation and sanitization
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
RahaneAiTech/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   │   ├── dashboard/ # Dashboard pages
│   │   │   ├── login/     # Authentication pages
│   │   │   └── register/  # Registration page
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   └── layout/    # Layout components
│   │   └── lib/          # Utilities and API
│   └── package.json
├── server/                # Express.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── index.js         # Server entry point
└── README.md
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RahaneAiTech
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/admin-dashboard
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start the server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the client**
   ```bash
   cd client
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👥 User Roles & Permissions

### 🔴 Admin
- **Full Access**: Complete control over user management and system monitoring
- **User Management**: Create, edit, delete users and change roles
- **System Monitoring**: View comprehensive activity logs
- **No Content Access**: Cannot create, edit, or view content
- **Analytics**: Access to system statistics and reports

### 🔵 Editor
- **Content Creation**: Create, edit, and delete posts and comments
- **Content Management**: Access to content management features
- **Limited Scope**: Restricted to content operations only
- **No User Management**: Cannot manage users or view logs

### 🟢 Viewer
- **Read-Only Access**: View published content and dashboard
- **Content Library**: Browse and read content
- **No Management**: Cannot create, edit, or delete content
- **No User Management**: Cannot manage users or view logs

## 📱 Responsive Design Features

### Mobile Experience (< 640px)
- **Hamburger Menu**: Collapsible sidebar navigation
- **Touch-Optimized**: Larger touch targets and buttons
- **Card Layouts**: Mobile-friendly card-based displays
- **Compact Typography**: Optimized text sizing
- **Full-Width Elements**: Buttons and forms adapt to screen

### Tablet Experience (640px - 1024px)
- **Hybrid Navigation**: Sidebar with mobile features
- **Balanced Layout**: Optimal use of screen space
- **Medium Spacing**: Comfortable reading experience

### Desktop Experience (> 1024px)
- **Full Layout**: Maximum information density
- **Hover States**: Rich interactive feedback
- **Professional UI**: Polished desktop interface

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/role` - Update user role
- `PATCH /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - User statistics

### Content (Admin & Editor)
- `GET /api/content` - Get all content
- `GET /api/content/:id` - Get content by ID
- `POST /api/content` - Create new content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content
- `GET /api/content/stats/overview` - Content statistics

### Logs (Admin Only)
- `GET /api/logs` - Get activity logs
- `GET /api/logs/stats/overview` - Log statistics
- `GET /api/logs/user/:userId` - Get logs by user
- `GET /api/logs/action/:action` - Get logs by action
- `GET /api/logs/export/csv` - Export logs to CSV

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **Role-based Authorization** - Middleware for route protection
- **Input Validation** - Express-validator for data validation
- **Rate Limiting** - Protection against brute force attacks
- **CORS Configuration** - Cross-origin resource sharing
- **Security Headers** - Helmet for additional security
- **Error Handling** - Comprehensive error management

## 🗄️ Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: String (admin/editor/viewer),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Content Model
```javascript
{
  title: String,
  content: String,
  type: String (post/comment),
  author: ObjectId (ref: User),
  status: String (draft/published/archived),
  tags: [String],
  parentContent: ObjectId (ref: Content),
  createdAt: Date,
  updatedAt: Date
}
```

### ActivityLog Model
```javascript
{
  user: ObjectId (ref: User),
  action: String,
  resource: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

## 🎨 UI Components

### Authentication Components
- `AuthLayout` - Responsive authentication layout
- `FormInput` - Reusable form input with validation
- `SubmitButton` - Loading state button component
- `RoleSelector` - Interactive role selection

### Layout Components
- `DashboardLayout` - Main dashboard layout with responsive sidebar
- `Sidebar` - Collapsible navigation with mobile support

### Features
- **Responsive Tables**: Desktop tables with mobile card alternatives
- **Modal Dialogs**: Responsive modals for forms and confirmations
- **Toast Notifications**: Real-time user feedback
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages

## 🚀 Performance Optimizations

- **Component Reusability**: Shared components reduce bundle size
- **Responsive Images**: Optimized for different screen sizes
- **Lazy Loading**: Components load on demand
- **Efficient State Management**: Minimal re-renders
- **Mobile-First CSS**: Optimized for mobile performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email support@example.com or create an issue in the repository.

---

**Built with ❤️ using Next.js, Express.js, and MongoDB**

