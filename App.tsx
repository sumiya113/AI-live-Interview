
import React, { useState, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import InterviewScreen from './components/InterviewScreen';
import FeedbackScreen from './components/FeedbackScreen';
import { AppState, TranscriptEntry, InterviewConfig } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SETUP);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const handleStartInterview = useCallback((config: InterviewConfig) => {
    setInterviewConfig(config);
    setTranscript([]);
    setAppState(AppState.INTERVIEW);
  }, []);

  const handleFinishInterview = useCallback((finalTranscript: TranscriptEntry[]) => {
    setTranscript(finalTranscript);
    setAppState(AppState.FEEDBACK);
  }, []);

  const handleNewInterview = useCallback(() => {
    setInterviewConfig(null);
    setTranscript([]);
    setAppState(AppState.SETUP);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.SETUP:
        return <SetupScreen onStart={handleStartInterview} />;
      case AppState.INTERVIEW:
        if (!interviewConfig) {
           // Should not happen, but as a fallback
           return <SetupScreen onStart={handleStartInterview} />;
        }
        return <InterviewScreen interviewConfig={interviewConfig} onFinish={handleFinishInterview} />;
      case AppState.FEEDBACK:
         if (!interviewConfig) {
           // Should not happen, but as a fallback
           return <SetupScreen onStart={handleStartInterview} />;
        }
        return <FeedbackScreen transcript={transcript} interviewConfig={interviewConfig} onNewInterview={handleNewInterview} />;
      default:
        return <SetupScreen onStart={handleStartInterview} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
