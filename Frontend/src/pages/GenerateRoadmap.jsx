import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Rocket, 
  CheckCircle,
  Code,
  Database,
  Cloud,
  Layers,
  Terminal,
  Cpu,
  Loader2,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roadmapsAPI } from '../utils/api';

const GenerateRoadmap = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    roadmapName: '',
    skillLevel: '',
    includeProjects: false,
    techStack: {
      languages: [],
      frameworks: [],
      libraries: [],
      databases: [],
      devops: [],
      otherTech: []
    }
  });

  const navigate = useNavigate();

  const techOptions = {
    languages: [
      'JavaScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust', 
      'Ruby', 'PHP', 'Kotlin', 'Swift', 'Dart', 'TypeScript'
    ],
    frameworks: [
      'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
      'Express.js', 'Django', 'Flask', 'Spring Boot', 'FastAPI', 
      'Rails', 'NestJS', 'Laravel'
    ],
    libraries: [
      'Redux', 'TailwindCSS', 'Bootstrap', 'TensorFlow', 'PyTorch', 
      'OpenCV', 'Three.js', 'D3.js', 'jQuery', 'Lodash', 'Axios'
    ],
    databases: [
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase', 
      'Cassandra', 'Neo4j', 'Supabase', 'SQLite', 'Oracle'
    ],
    devops: [
      'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 
      'CI/CD', 'GitHub Actions', 'Jenkins', 'Nginx'
    ],
    otherTech: [
      'Blockchain', 'Solidity', 'Web3.js', 'Hardhat', 'AI/ML', 
      'Data Engineering', 'Cybersecurity', 'GraphQL', 'WebAssembly'
    ]
  };

  const steps = [
    { title: 'Roadmap Details', icon: Rocket },
    { title: 'Skill Level', icon: Target },
    { title: 'Tech Stack', icon: Code },
    { title: 'Generate', icon: CheckCircle }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTechStackChange = (category, tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: {
        ...prev.techStack,
        [category]: prev.techStack[category].includes(tech)
          ? prev.techStack[category].filter(t => t !== tech)
          : [...prev.techStack[category], tech]
      }
    }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const roadmap = await roadmapsAPI.generate(formData);
      navigate(`/roadmap/${roadmap._id}`);
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.roadmapName.trim() !== '';
      case 2:
        return formData.skillLevel !== '';
      case 3:
        return Object.values(formData.techStack).some(arr => arr.length > 0);
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Roadmap Name
              </label>
              <input
                type="text"
                value={formData.roadmapName}
                onChange={(e) => handleInputChange('roadmapName', e.target.value)}
                placeholder="Full Stack Web Development, Data Science Fundamentals..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>

            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.includeProjects}
                  onChange={(e) => handleInputChange('includeProjects', e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-700 font-medium">Include practical projects</span>
              </label>
              <p className="text-sm text-slate-600 mt-2 ml-8">
                Add hands-on projects to reinforce your learning.
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              What&apos;s your current skill level?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'beginner', title: 'Beginner', description: 'New to programming', icon: '🌱' },
                { value: 'intermediate', title: 'Intermediate', description: 'Some experience & projects', icon: '🚀' },
                { value: 'advanced', title: 'Advanced', description: 'Experienced developer', icon: '⚡' }
              ].map((level) => (
                <div
                  key={level.value}
                  onClick={() => handleInputChange('skillLevel', level.value)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.skillLevel === level.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{level.icon}</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">{level.title}</h4>
                      <p className="text-sm text-slate-600">{level.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Select technologies you want to learn
            </h3>

            {Object.entries(techOptions).map(([category, options]) => {
              const icons = {
                languages: <Code className="w-5 h-5" />,
                frameworks: <Layers className="w-5 h-5" />,
                libraries: <Terminal className="w-5 h-5" />,
                databases: <Database className="w-5 h-5" />,
                devops: <Cloud className="w-5 h-5" />,
                otherTech: <Cpu className="w-5 h-5" />
              };

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-blue-600">{icons[category]}</div>
                    <h4 className="font-semibold text-slate-900 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {options.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => handleTechStackChange(category, tech)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                          formData.techStack[category].includes(tech)
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Rocket className="w-8 h-8 text-blue-600" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              Ready to Generate Your Roadmap!
            </h3>

            <div className="bg-slate-50 rounded-lg p-6 text-left max-w-md mx-auto">
              <h4 className="font-semibold text-slate-900 mb-3">Summary:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><strong>Name:</strong> {formData.roadmapName}</li>
                <li><strong>Level:</strong> {formData.skillLevel}</li>
                <li><strong>Projects:</strong> {formData.includeProjects ? 'Yes' : 'No'}</li>
                <li><strong>Technologies:</strong> {Object.values(formData.techStack).flat().length} selected</li>
              </ul>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  <span>Generate Roadmap</span>
                </>
              )}
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Generate Your Learning Roadmap
        </h1>
        <p className="text-slate-600">
          Create a personalized learning path powered by AI
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : isActive 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : stepNumber}
              </div>
              <span className={`text-sm font-medium ${
                isActive ? 'text-slate-900' : 'text-slate-600'
              }`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {currentStep < 4 && (
        <div className="flex flex-col sm:flex-row justify-between mt-8 space-y-3 sm:space-y-0">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-6 py-3 border rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={!canProceedToNext()}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateRoadmap;
