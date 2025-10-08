
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TranscriptEntry, InterviewConfig, Feedback } from '../types';
import { generateInterviewFeedback } from '../services/geminiService';
import { LoadingSpinnerIcon, ThumbsUpIcon, ThumbsDownIcon, LightbulbIcon, CheckCircleIcon } from './icons';

interface FeedbackScreenProps {
  transcript: TranscriptEntry[];
  interviewConfig: InterviewConfig;
  onNewInterview: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ transcript, interviewConfig, onNewInterview }) => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFeedback = async () => {
      if (transcript.length === 0) {
        setError("Cannot generate feedback for an empty interview.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const result = await generateInterviewFeedback(transcript, interviewConfig);
        setFeedback(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    getFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript, interviewConfig]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <LoadingSpinnerIcon className="w-16 h-16" />
        <p className="mt-4 text-lg text-gray-300">Analyzing your performance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center h-[80vh] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-red-500">Error Generating Feedback</h2>
        <p className="text-gray-400 mt-2">{error}</p>
        <button
          onClick={onNewInterview}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Try a New Interview
        </button>
      </div>
    );
  }
  
  const scoreColor = feedback && feedback.overallScore >= 75 ? 'text-green-400' : feedback && feedback.overallScore >= 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="p-6 bg-gray-800 rounded-2xl max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold">Interview Feedback</h1>
         <button
          onClick={onNewInterview}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          New Interview
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Overall Score and Key Takeaways */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-300">Overall Score</h3>
            <p className={`text-6xl font-bold mt-2 ${scoreColor}`}>{feedback?.overallScore}/100</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg">
             <h3 className="text-lg font-semibold mb-3 flex items-center"><ThumbsUpIcon className="w-5 h-5 mr-2 text-green-400"/>Strengths</h3>
             <ul className="space-y-2 list-inside">
                {feedback?.strengths.map((s, i) => <li key={i} className="text-gray-300 flex items-start"><CheckCircleIcon className="w-4 h-4 mr-2 mt-1 text-green-500 flex-shrink-0"/>{s}</li>)}
             </ul>
          </div>
           <div className="bg-gray-900 p-6 rounded-lg">
             <h3 className="text-lg font-semibold mb-3 flex items-center"><ThumbsDownIcon className="w-5 h-5 mr-2 text-yellow-400"/>Areas for Improvement</h3>
             <ul className="space-y-2 list-inside">
                {feedback?.areasForImprovement.map((a, i) => <li key={i} className="text-gray-300 flex items-start"><LightbulbIcon className="w-4 h-4 mr-2 mt-1 text-yellow-500 flex-shrink-0"/>{a}</li>)}
             </ul>
          </div>
        </div>
        
        {/* Right Panel: Question Breakdown Chart */}
        <div className="lg:col-span-2 bg-gray-900 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Question Score Breakdown</h3>
           <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedback?.questionScores} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="question" tick={{ fill: '#A0AEC0', fontSize: 12 }} tickFormatter={(value) => value.substring(0, 15) + '...'}/>
                <YAxis tick={{ fill: '#A0AEC0' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                  labelStyle={{ color: '#E2E8F0' }}
                  formatter={(value, name, props) => [`${value}/100`, `Score for "${props.payload.question}"`]}
                />
                <Legend wrapperStyle={{ color: '#E2E8F0' }}/>
                <Bar dataKey="score" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
           </div>
           <div className="mt-6 space-y-4 max-h-48 overflow-y-auto">
             {feedback?.questionScores.map((q, i) => (
                <div key={i} className="bg-gray-800 p-3 rounded-md">
                    <p className="font-semibold text-gray-200">{i+1}. {q.question}</p>
                    <p className="text-sm text-gray-400 mt-1">{q.feedback}</p>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackScreen;
