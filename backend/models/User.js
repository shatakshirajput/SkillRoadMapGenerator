import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  passwordHash: { 
    type: String 
  },
  authProvider: { 
    type: String, 
    enum: ['local', 'google', 'github'], 
    default: 'local' 
  },
  providerId: { 
    type: String 
  },
  avatar: {
    type: String
  },
  roadmaps: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Roadmap' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model('User', UserSchema);