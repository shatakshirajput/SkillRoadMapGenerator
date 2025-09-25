import mongoose from 'mongoose';

const TopicSchema = new mongoose.Schema({
  topicTitle: { 
    type: String, 
    required: true 
  },
  resources: [{ 
    type: String 
  }],
  category: { 
    type: String, 
    enum: ['language', 'framework', 'library', 'database', 'devops', 'other'], 
    required: true 
  },
  project: { 
    type: String 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  completedAt: {
    type: Date
  }
});

const StageSchema = new mongoose.Schema({
  stageTitle: { 
    type: String, 
    required: true 
  },
  duration: { 
    type: String 
  },
  topics: [TopicSchema]
});

const RoadmapSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  totalDuration: { 
    type: String 
  },
  skillLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'] 
  },
  includeProjects: { 
    type: Boolean, 
    default: false 
  },
  techStack: {
    languages: [{ type: String }],
    frameworks: [{ type: String }],
    libraries: [{ type: String }],
    databases: [{ type: String }],
    devops: [{ type: String }],
    otherTech: [{ type: String }]
  },
  stages: [StageSchema],
  progress: { 
    type: Number, 
    default: 0 
  },
  totalTopics: {
    type: Number,
    default: 0
  },
  completedTopics: {
    type: Number,
    default: 0
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

RoadmapSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate total topics and progress
  let totalTopics = 0;
  let completedTopics = 0;
  
  this.stages.forEach(stage => {
    totalTopics += stage.topics.length;
    completedTopics += stage.topics.filter(topic => topic.completed).length;
  });
  
  this.totalTopics = totalTopics;
  this.completedTopics = completedTopics;
  this.progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  
  next();
});

export default mongoose.model('Roadmap', RoadmapSchema);