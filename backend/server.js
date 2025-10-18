import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import roleRoutes from './routes/role.routes.js';
import permissionRoutes from './routes/permissions.routes.js';
import doctorRouts from './routes/Doctor.routes.js';
import PatientRoutes from './routes/Patient.routes.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/doctor",doctorRouts)
app.use("/api/Patient",PatientRoutes)

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const status = dbStatus === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({ 
    status: 'OK', 
    message: 'EHR Backend is running',
    database: status,
    timestamp: new Date().toISOString()
  });
});

// Database connection - handles both Docker and local development
const connectDB = async () => {
  try {
    // Use different URIs for Docker vs local development
    const isDocker = process.env.NODE_ENV === 'development' && process.env.MONGODB_URI;
    const mongoURI = isDocker 
      ? process.env.MONGODB_URI 
      : "mongodb://localhost:27017/ehr";
    
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('Connecting to:', mongoURI);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('💡 Tip: Make sure MongoDB is running');
    console.log('For Docker: run "docker-compose up"');
    console.log('For local: make sure MongoDB is installed and running on localhost:27017');
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();