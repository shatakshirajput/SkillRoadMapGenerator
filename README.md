# 🚀 Roadmap Generator

A powerful MERN stack application that generates personalized learning roadmaps using Gemini AI. Track your progress, manage multiple roadmaps, and advance your skills with structured guidance.

## ✨ Features

- **AI-Powered Generation**: Create personalized learning roadmaps using Gemini AI
- **Multi-Tech Stack Support**: 50+ technologies including React, Python, AWS, and more
- **Progress Tracking**: Visual progress indicators and completion statistics  
- **Multiple Authentication**: Email/password, Google OAuth, and GitHub OAuth
- **Responsive Design**: Clean, minimal UI inspired by ikiform.com
- **Interactive Charts**: Progress visualization with Recharts
- **Project Integration**: Optional hands-on projects for each roadmap

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend  
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **Gemini AI** - Roadmap generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Gemini API key
- OAuth credentials (Google & GitHub)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roadmap-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/roadmap-generator
   JWT_SECRET=your-super-secret-jwt-key
   GEMINI_API_KEY=your-gemini-api-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the backend (port 5000) and frontend (port 5173) concurrently.

## 🏗️ Project Structure

```
roadmap-generator/
├── server.js                 # Express server entry point
├── models/                   # MongoDB schemas
│   ├── User.js              # User model
│   └── Roadmap.js           # Roadmap model
├── routes/                   # API routes
│   ├── auth.js              # Authentication routes
│   └── roadmaps.js          # Roadmap CRUD routes
├── config/                   # Configuration files
│   └── passport.js          # Passport strategies
├── middleware/               # Custom middleware
│   └── auth.js              # JWT authentication
├── src/                      # React frontend
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   ├── contexts/            # React contexts
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
└── public/                   # Static assets
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth

### Roadmaps
- `POST /api/roadmaps/generate` - Generate new roadmap
- `GET /api/roadmaps` - Get user's roadmaps
- `GET /api/roadmaps/:id` - Get specific roadmap
- `PATCH /api/roadmaps/:roadmapId/topics/:topicId/complete` - Update topic completion
- `DELETE /api/roadmaps/:id` - Delete roadmap

## 🎨 Design Philosophy

The application follows a clean, minimal design philosophy inspired by ikiform.com:

- **Clean Typography**: Inter font family with proper line heights
- **Consistent Spacing**: 8px grid system throughout
- **Subtle Animations**: Smooth transitions using Framer Motion
- **Color System**: Blue primary, teal secondary, with proper contrast ratios
- **Mobile-First**: Responsive design for all screen sizes

## 🔧 Configuration

### MongoDB Schema
The application uses two main schemas:

1. **User Schema**: Handles user authentication and profile data
2. **Roadmap Schema**: Stores roadmap structure with stages, topics, and progress tracking

### Gemini AI Integration
Roadmaps are generated using a structured prompt that includes:
- User's skill level and preferences
- Selected technology stack
- Project requirements
- Learning duration estimates

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure OAuth applications for Google and GitHub
3. Obtain Gemini API key from Google AI Studio
4. Set production environment variables

### Build for Production
```bash
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Gemini AI](https://ai.google.dev/) for roadmap generation
- [ikiform.com](https://ikiform.com/) for design inspiration
- [Lucide](https://lucide.dev/) for beautiful icons
- [Recharts](https://recharts.org/) for data visualization

---

Built with ❤️ for developers looking to advance their skills with structured learning paths.