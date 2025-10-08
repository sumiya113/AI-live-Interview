import React, { useState } from 'react';
import { JobRole, Difficulty, InterviewConfig } from '../types';
import { JOB_ROLES, DIFFICULTIES } from '../constants';
import { LogoIcon } from './icons';

interface SetupScreenProps {
  onStart: (config: InterviewConfig) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [role, setRole] = useState<JobRole>(JOB_ROLES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTIES[1]);
  const [jobDescription, setJobDescription] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If a job description is provided, it takes precedence.
    if (jobDescription.trim() !== '') {
      onStart({ type: 'jd', jobDescription, numQuestions });
    } else {
      // Otherwise, use the selected role and difficulty.
      onStart({ type: 'role', role, difficulty });
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg">
        <div className="text-center">
            <div className="flex justify-center items-center mb-4">
               <LogoIcon className="h-12 w-12 text-indigo-400" />
            </div>
          <h1 className="text-3xl font-bold text-white">AI Interview Practice</h1>
          <p className="mt-2 text-gray-400">Configure your practice session to begin.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
            {/* All fields are now in a single column */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                Job Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as JobRole)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {JOB_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
           
            <div>
             <label htmlFor="job-description" className="block text-sm font-medium text-gray-300 mb-2">
                Practice with a Job Description (Optional)
             </label>
             <textarea
                id="job-description"
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Paste a job description here for a tailored interview. This will override the role selection above."
             />
            </div>
            <div>
              <label htmlFor="num-questions" className="block text-sm font-medium text-gray-300 mb-2">
                Number of Questions (for Job Description)
              </label>
              <select
                id="num-questions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={jobDescription.trim() === ''}
                aria-disabled={jobDescription.trim() === ''}
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
              </select>
           </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
            >
              Start Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;