import React, { useRef, useEffect } from 'react';
import { InterviewConfig, TranscriptEntry } from '../types';
import { useInterview } from '../hooks/useInterview';
import { UserIcon, BotIcon, LoadingSpinnerIcon, ClockIcon } from './icons';
import Avatar from './Avatar';

interface InterviewScreenProps {
  interviewConfig: InterviewConfig;
  onFinish: (transcript: TranscriptEntry[]) => void;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ interviewConfig, onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  const {
    status,
    transcript,
    error,
    endInterview,
    isModelSpeaking,
    elapsedTime,
  } = useInterview({ interviewConfig, onFinish, videoElement: videoRef });

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcript]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[85vh] max-h-[800px]">
      {/* Video and Status Panel */}
      <div className="md:col-span-2 bg-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* AI Avatar */}
        <Avatar isSpeaking={isModelSpeaking} className="max-w-md w-full p-8" />
        
        {/* User's Video Preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-1/4 max-w-[200px] h-auto rounded-lg shadow-lg transform scale-x-[-1] border-2 border-gray-700"
        />

        <div className="absolute top-4 left-4 flex items-center space-x-2">
            <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {status}
            </div>
            {status === 'Connected' && (
                <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-mono flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4" />
                    <span>{formatTime(elapsedTime)}</span>
                </div>
            )}
        </div>

        {status === 'Connecting...' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <LoadingSpinnerIcon className="w-16 h-16" />
          </div>
        )}
         {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500 bg-opacity-80 text-white p-3 rounded-lg text-sm">
                <p className="font-bold">An error occurred:</p>
                <p>{error}</p>
            </div>
        )}
      </div>

      {/* Transcript and Controls Panel */}
      <div className="md:col-span-1 bg-gray-800 rounded-2xl p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-3">Interview Transcript</h2>
        <div ref={transcriptContainerRef} className="flex-grow overflow-y-auto space-y-4 pr-2">
          {transcript.map((entry, index) => (
            <div key={index} className={`flex items-start gap-3 ${entry.source === 'user' ? 'flex-row-reverse' : ''}`}>
              {entry.source === 'model' && <BotIcon className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />}
              <div className={`px-4 py-2 rounded-lg max-w-xs ${entry.source === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700'}`}>
                <p className="text-sm">{entry.text}</p>
              </div>
              {entry.source === 'user' && <UserIcon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-1" />}
            </div>
          ))}
           {transcript.length === 0 && status !== 'Connecting...' && (
            <div className="text-center text-gray-400 pt-10">
                <p>The interview will begin shortly.</p>
                <p>The AI interviewer will ask the first question.</p>
            </div>
           )}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700">
           <button
            onClick={endInterview}
            disabled={status !== 'Connected'}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            End Interview
          </button>
        </div>
      </div>
    </div>
  );
};


export default InterviewScreen;