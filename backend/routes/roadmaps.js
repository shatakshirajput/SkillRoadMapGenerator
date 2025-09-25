import express from 'express';
import axios from 'axios';
import Roadmap from '../models/Roadmap.js';
import User from '../models/User.js';
import { authenticateJWT } from '../middleware/auth.js';
import process from 'process';
const router = express.Router();

// Generate roadmap with Gemini AI
router.post('/generate', authenticateJWT, async (req, res) => {
  try {
    const { roadmapName, skillLevel, includeProjects, techStack } = req.body;

    // Construct prompt for Gemini
    const prompt = `You are an expert software engineering learning assistant.
Generate a structured learning roadmap for a user with the following inputs:
- Roadmap Name: ${roadmapName}
- Skill Level: ${skillLevel}
- Include Projects: ${includeProjects}
- Tech Stack:
  - Languages: ${techStack.languages?.join(', ') || 'None'}
  - Frontend Frameworks: ${techStack.frameworks?.filter(f => ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'].includes(f)).join(', ') || 'None'}
  - Backend Frameworks: ${techStack.frameworks?.filter(f => ['Express.js', 'Django', 'Flask', 'Spring Boot', 'FastAPI', 'Rails', 'NestJS', 'Laravel'].includes(f)).join(', ') || 'None'}
  - Libraries: ${techStack.libraries?.join(', ') || 'None'}
  - Databases: ${techStack.databases?.join(', ') || 'None'}
  - DevOps & Cloud: ${techStack.devops?.join(', ') || 'None'}
  - Other Tech: ${techStack.otherTech?.join(', ') || 'None'}

Return a JSON response in this exact format:
{
  "title": "string",
  "description": "string",
  "totalDuration": "string (e.g., '12 weeks')",
  "stages": [
    {
      "stageTitle": "string",
      "duration": "string (e.g., '2 weeks')",
      "topics": [
        {
          "topicTitle": "string",
          "resources": ["resource1", "resource2"],
          "category": "language|framework|library|database|devops|other",
          "project": "string (only if includeProjects=true)"
        }
      ]
    }
  ]
}

Make sure to provide practical, real-world resources like documentation links, tutorials, and courses. Keep the roadmap comprehensive but achievable for the specified skill level.`;

    // Call Gemini API
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    let geminiText = geminiResponse.data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response from AI');
    }

    const roadmapData = JSON.parse(jsonMatch[0]);

    // Create roadmap in database
    const roadmap = new Roadmap({
      title: roadmapData.title,
      description: roadmapData.description,
      totalDuration: roadmapData.totalDuration,
      skillLevel,
      includeProjects,
      techStack,
      stages: roadmapData.stages,
      createdBy: req.user._id
    });

    await roadmap.save();

    // Add to user's roadmaps
    await User.findByIdAndUpdate(req.user._id, {
      $push: { roadmaps: roadmap._id }
    });

    res.status(201).json(roadmap);
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to generate roadmap', 
      error: error.message 
    });
  }
});

// Get user's roadmaps
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific roadmap
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update topic completion
router.patch('/:roadmapId/topics/:topicId/complete', authenticateJWT, async (req, res) => {
  try {
    const { roadmapId, topicId } = req.params;
    const { completed } = req.body;

    const roadmap = await Roadmap.findOne({
      _id: roadmapId,
      createdBy: req.user._id
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Find and update topic
    let topicFound = false;
    roadmap.stages.forEach(stage => {
      stage.topics.forEach(topic => {
        if (topic._id.toString() === topicId) {
          topic.completed = completed;
          topic.completedAt = completed ? new Date() : null;
          topicFound = true;
        }
      });
    });

    if (!topicFound) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete roadmap
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Remove from user's roadmaps
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { roadmaps: req.params.id }
    });

    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;