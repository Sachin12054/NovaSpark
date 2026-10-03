import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Clock, 
  Code, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Cpu, 
  Terminal, 
  BookOpen, 
  Layers,
  Flame
} from 'lucide-react';
import { ProjectRecommendInput, ProjectRecommendation } from '../types';
import { recommendProject } from '../services/api';

interface ProjectPageProps {
  navigate: (path: string) => void;
  onSelectProjectForRegistration?: (projectTitle: string) => void;
}

export const ProjectPage: React.FC<ProjectPageProps> = ({ navigate, onSelectProjectForRegistration }) => {
  const [formData, setFormData] = useState<ProjectRecommendInput>({
    branch: 'Computer Science (CSE)',
    year: 'Final Year',
    coding_experience: 'Beginner',
    preferred_area: 'Generative AI & LLMs',
    ai_experience: 'None (Absolute beginner)',
    what_to_build: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<ProjectRecommendation | null>(null);

  const branches = [
    'Computer Science (CSE)',
    'AI & Data Science (AIDS)',
    'Information Technology (IT)',
    'Electronics & Comm (ECE)',
    'Electrical & Electronics (EEE)',
    'Mechanical / Civil / Other'
  ];

  const years = ['Final Year', '3rd Year', '2nd Year', '1st Year'];

  const codingLevels = [
    { label: 'Beginner', desc: 'Know basic loops, variables, and simple syntax' },
    { label: 'Intermediate', desc: 'Comfortable with functions, APIs, and frameworks' },
    { label: 'Advanced', desc: 'Experience with full-stack or complex software architectures' }
  ];

  const areas = [
    { label: 'Generative AI & LLMs', icon: Sparkles, desc: 'Prompt engineering, text embeddings & agent tools' },
    { label: 'AI Chatbots & RAG', icon: Terminal, desc: 'Vector search on college syllabus & documents' },
    { label: 'Computer Vision', icon: Cpu, desc: 'Webcam image processing, face & object detection' },
    { label: 'Web + AI Integration', icon: Layers, desc: 'Full-stack apps with FastAPI, React & LLM APIs' },
    { label: 'Machine Learning & Data', icon: BookOpen, desc: 'Predictive models for placements and salary analytics' },
    { label: 'Autonomous Agents', icon: Flame, desc: 'Automated LinkedIn search and cold outreach bots' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await recommendProject(formData);
      setRecommendation(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildAtWorkshop = () => {
    if (recommendation && onSelectProjectForRegistration) {
      onSelectProjectForRegistration(recommendation.project_title);
    }
    navigate('/register');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Project Discovery Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Find Your AI Project
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Match your branch, coding comfort level, and target interests to a tangible 60-minute build plan.
        </p>
      </div>

      {!recommendation ? (
        /* Discovery Input Form */
        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Branch */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Engineering Branch
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Coding Experience Level */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Coding Experience
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {codingLevels.map(lvl => (
                <div
                  key={lvl.label}
                  onClick={() => setFormData({ ...formData, coding_experience: lvl.label })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.coding_experience === lvl.label
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm">{lvl.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-snug">{lvl.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Interest Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Preferred AI Area
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {areas.map(area => {
                const Icon = area.icon;
                const isSelected = formData.preferred_area === area.label;
                return (
                  <div
                    key={area.label}
                    onClick={() => setFormData({ ...formData, preferred_area: area.label })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span className="font-bold text-xs">{area.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-snug">{area.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Experience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Current AI Knowledge
            </label>
            <select
              value={formData.ai_experience}
              onChange={(e) => setFormData({ ...formData, ai_experience: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="None (Absolute beginner)">None (Absolute beginner — haven't used AI APIs yet)</option>
              <option value="Read theory & articles">Read theory & articles (Know ChatGPT/LLM concepts)</option>
              <option value="Built basic tutorials">Built basic tutorials (Used OpenAI / Gemini Python packages)</option>
              <option value="Built deployed apps">Built deployed apps (Looking to build production capstone)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Student Profile...
              </span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate My Custom AI Project</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Generated Project Card */
        <div className="space-y-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/40 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                  Difficulty: {recommendation.difficulty}
                </span>
                <span className="px-3 py-1 text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Build Time: {recommendation.estimated_build_time}</span>
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Tailored for {formData.year} {formData.branch}
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-widest font-mono text-indigo-400 font-bold">
                RECOMMENDED WORKSHOP PROJECT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {recommendation.project_title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {recommendation.tagline}
              </p>
            </div>

            {/* Why This Fits You Pill */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 leading-relaxed">
              <strong className="text-white block mb-1">🎯 Why this fits you:</strong>
              {recommendation.why_this_fits_you}
            </div>

            {/* Tech Stack */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Recommended Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {recommendation.tech_stack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-indigo-300 text-xs font-mono font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                What You Will Learn & Deploy in 60 Minutes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {recommendation.what_you_will_learn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Snippet Preview */}
            {recommendation.starter_code_preview && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono">Starter Implementation Preview</span>
                  <span className="text-[11px] text-indigo-400">Workshop Repo Template</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#070a10] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                  <code>{recommendation.starter_code_preview}</code>
                </pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBuildAtWorkshop}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Build This at the Workshop →</span>
              </button>

              <button
                onClick={() => setRecommendation(null)}
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Another Project</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
