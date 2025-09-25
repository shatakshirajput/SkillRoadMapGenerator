import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Clock, TrendingUp, Target, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roadmapsAPI } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRoadmaps: 0,
    avgProgress: 0,
    totalTopics: 0,
    completedTopics: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const data = await roadmapsAPI.getAll();
      setRoadmaps(data);

      const totalRoadmaps = data.length;
      const totalProgress = data.reduce((sum, roadmap) => sum + roadmap.progress, 0);
      const avgProgress = totalRoadmaps > 0 ? Math.round(totalProgress / totalRoadmaps) : 0;
      const totalTopics = data.reduce((sum, roadmap) => sum + roadmap.totalTopics, 0);
      const completedTopics = data.reduce((sum, roadmap) => sum + roadmap.completedTopics, 0);

      setStats({
        totalRoadmaps,
        avgProgress,
        totalTopics,
        completedTopics
      });
    } catch (error) {
      console.error('Failed to fetch roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoadmap = async (roadmapId, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this roadmap?')) {
      try {
        await roadmapsAPI.delete(roadmapId);
        setRoadmaps(roadmaps.filter(r => r._id !== roadmapId));
      } catch (error) {
        console.error('Failed to delete roadmap:', error);
      }
    }
  };

  const getSkillLevelColor = (skillLevel) => {
    switch (skillLevel) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const progressData = roadmaps.map(roadmap => ({
    name: roadmap.title.length > 20 ? roadmap.title.substring(0, 20) + '...' : roadmap.title,
    progress: roadmap.progress
  }));

  const pieData = [
    { name: 'Completed', value: stats.completedTopics, color: '#10b981' },
    { name: 'Remaining', value: stats.totalTopics - stats.completedTopics, color: '#e5e7eb' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Track your learning progress and manage your roadmaps</p>
          </div>
          <motion.button
            onClick={() => navigate('/generate')}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Plus className="w-5 h-5" />
            <span>Generate New Roadmap</span>
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: 'Total Roadmaps', value: stats.totalRoadmaps, icon: BookOpen, color: 'blue' },
            { title: 'Average Progress', value: `${stats.avgProgress}%`, icon: TrendingUp, color: 'green' },
            { title: 'Topics Completed', value: stats.completedTopics, icon: Target, color: 'purple' },
            { title: 'Total Topics', value: stats.totalTopics, icon: Clock, color: 'orange' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        {roadmaps.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Progress Chart */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Roadmap Progress</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Completion Overview */}
            <motion.div
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Overall Completion</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-600">Remaining</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Roadmaps Grid */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Roadmaps</h2>

          {roadmaps.length === 0 ? (
            <motion.div
              className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No roadmaps yet</h3>
              <p className="text-slate-600 mb-6">Create your first personalized learning roadmap</p>
              <button
                onClick={() => navigate('/generate')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow"
              >
                Generate Your First Roadmap
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => navigate(`/roadmap/${roadmap._id}`)}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 pr-2">
                        {roadmap.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/roadmap/${roadmap._id}`);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="View roadmap"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteRoadmap(roadmap._id, e)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete roadmap"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {roadmap.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        ...(roadmap.techStack.languages?.slice(0, 2) || []),
                        ...(roadmap.techStack.frameworks?.slice(0, 2) || [])
                      ].map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {(roadmap.techStack.languages?.length + roadmap.techStack.frameworks?.length) > 4 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                          +{(roadmap.techStack.languages?.length + roadmap.techStack.frameworks?.length) - 4} more
                        </span>
                      )}
                    </div>

                    {/* Skill Level */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(roadmap.skillLevel)}`}>
                        {roadmap.skillLevel?.charAt(0).toUpperCase() + roadmap.skillLevel?.slice(1)}
                      </span>
                      <span className="text-sm text-slate-500">
                        {roadmap.totalDuration}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Progress</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {roadmap.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${roadmap.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Topics Stats */}
                    <div className="text-sm text-slate-600">
                      {roadmap.completedTopics} of {roadmap.totalTopics} topics completed
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
