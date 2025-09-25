import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  ExternalLink,
  Clock,
  Target,
  BookOpen,
  Code2,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { roadmapsAPI } from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RoadmapDetail = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmap();
  }, [id]);

  const fetchRoadmap = async () => {
    try {
      const data = await roadmapsAPI.getById(id);
      setRoadmap(data);
    } catch (error) {
      console.error('Failed to fetch roadmap:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicToggle = async (stageIndex, topicIndex) => {
    const topic = roadmap.stages[stageIndex].topics[topicIndex];
    try {
      const updatedRoadmap = await roadmapsAPI.updateTopicCompletion(
        roadmap._id,
        topic._id,
        !topic.completed
      );
      setRoadmap(updatedRoadmap);
    } catch (error) {
      console.error('Failed to update topic completion:', error);
    }
  };

  const getSkillLevelColor = (skillLevel) => {
    switch (skillLevel) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'language': return '🔤';
      case 'framework': return '🏗️';
      case 'library': return '📚';
      case 'database': return '🗃️';
      case 'devops': return '☁️';
      default: return '⚙️';
    }
  };

  const getProgressData = () => {
    if (!roadmap?.stages) return [];

    let cumulativeCompleted = 0;
    let cumulativeTotal = 0;

    return roadmap.stages.map((stage, index) => {
      const completedInStage = stage.topics?.filter(t => t.completed).length || 0;
      const totalInStage = stage.topics?.length || 0;

      cumulativeCompleted += completedInStage;
      cumulativeTotal += totalInStage;

      return {
        stage: `Stage ${index + 1}`,
        completed: cumulativeCompleted,
        total: cumulativeTotal
      };
    });
  };

  const formatURL = (resource) => {
    // Extract URL anywhere in the resource string
    const match = resource.match(/https?:\/\/[^\s)]+/);
    if (match) return match[0];

    // If it looks like a domain without protocol
    if (/^[\w-]+(\.[\w-]+)+/.test(resource)) return `https://${resource}`;

    // Fallback: return null so we skip the link entirely
    return null;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Roadmap not found</p>
      </div>
    );
  }

  const progressData = getProgressData();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {roadmap.title}
        </h1>
        <p className="text-slate-600">{roadmap.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Progress Card */}
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Progress</p>
              <p className="text-xl md:text-2xl font-bold text-slate-900">{roadmap.progress}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
            <div
              className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${roadmap.progress}%` }}
            />
          </div>
        </motion.div>

        {/* Completed Topics Card */}
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Completed Topics</p>
              <p className="text-xl md:text-2xl font-bold text-slate-900">
                {roadmap.completedTopics}/{roadmap.totalTopics}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Duration Card */}
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Duration</p>
              <p className="text-xl md:text-2xl font-bold text-slate-900">{roadmap.totalDuration}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Skill Level Card */}
        <motion.div
          className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">Skill Level</p>
              <span className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full border ${getSkillLevelColor(roadmap.skillLevel)}`}>
                {roadmap.skillLevel?.charAt(0).toUpperCase() + roadmap.skillLevel?.slice(1)}
              </span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Progress Chart */}
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Progress Overview</h3>
            <div style={{ width: "100%", height: 250 }}>   {/* ✅ FIXED HEIGHT */}
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-500">No progress data available yet</p>
              )}
            </div>
          </motion.div>

          {/* Stages */}
          <div className="space-y-6">
            {roadmap.stages.map((stage, stageIndex) => (
              <motion.div
                key={stageIndex}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: stageIndex * 0.1 }}
              >
                <div className="p-4 sm:p-6 border-b border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <h3 className="text-xl font-semibold text-slate-900">
                      {stage.stageTitle}
                    </h3>
                    <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                      <span className="text-sm text-slate-600">{stage.duration}</span>
                      <div className="text-sm font-medium text-slate-700">
                        {stage.topics.filter(t => t.completed).length}/{stage.topics.length} completed
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {stage.topics.map((topic, topicIndex) => (
                      <div
                        key={topicIndex}
                        className={`p-4 rounded-lg border-2 transition-all ${topic.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                          <button
                            onClick={() => handleTopicToggle(stageIndex, topicIndex)}
                            className={`flex-shrink-0 mt-1 ${topic.completed ? 'text-green-600' : 'text-slate-400'} hover:text-blue-600 transition-colors`}
                          >
                            {topic.completed ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : (
                              <Circle className="w-6 h-6" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getCategoryIcon(topic.category)}</span>
                              <h4 className={`font-semibold ${topic.completed ? 'text-green-800' : 'text-slate-900'}`}>
                                {topic.topicTitle}
                              </h4>
                              <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs rounded-full">
                                {topic.category}
                              </span>
                            </div>

                            {topic.resources.map((resource, resourceIndex) => {
                              const url = formatURL(resource);
                              if (!url) return null; // Skip invalid URLs

                              const label = resource.replace(url, '').replace(/\s*[()]/g, '').trim() || url;

                              return (
                                <a
                                  key={resourceIndex}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span className="truncate">{label}</span>
                                </a>
                              );
                            })}

                            {topic.project && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                  <Code2 className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-800">Project</span>
                                </div>
                                <p className="text-sm text-blue-700">{topic.project}</p>
                              </div>
                            )}

                            {topic.completed && topic.completedAt && (
                              <div className="flex items-center space-x-2 mt-2 text-xs text-green-600">
                                <Calendar className="w-3 h-3" />
                                <span>Completed on {new Date(topic.completedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 space-y-6">
          <motion.div
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tech Stack</h3>
            <div className="space-y-4">
              {Object.entries(roadmap.techStack).map(([category, techs]) => {
                if (!techs || techs.length === 0) return null;
                return (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-slate-700 mb-2 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Stages</span>
                <span className="font-semibold text-slate-900">{roadmap.stages.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Projects Included</span>
                <span className="font-semibold text-slate-900">{roadmap.includeProjects ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Created</span>
                <span className="font-semibold text-slate-900">{new Date(roadmap.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
