
import React, { useState, useCallback } from 'react';
import { LessonPlanFormParams, LessonPlan } from './types';
import { generateLessonPlan } from './services/geminiService';
import LessonPlanForm from './components/LessonPlanForm';
import LessonPlanDisplay from './components/LessonPlanDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { SparklesIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async (params: LessonPlanFormParams) => {
    setIsLoading(true);
    setError(null);
    setLessonPlan(null);
    try {
      const plan = await generateLessonPlan(params);
      setLessonPlan(plan);
    } catch (err) {
      console.error(err);
      setError('Failed to generate the lesson plan. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white p-4 rounded-full shadow-sm">
            <SparklesIcon className="w-8 h-8 text-indigo-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              AI Project-Based Lesson Planner
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Generate comprehensive, project-based lesson plans aligned with Oklahoma standards, infused with the 4 C's of 21st-century learning.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LessonPlanForm onSubmit={handleGeneratePlan} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2">
            {isLoading && (
              <div className="flex flex-col items-center justify-center bg-white p-12 rounded-2xl shadow-lg h-full">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-medium text-indigo-600">Generating your lesson plan...</p>
                <p className="text-gray-500">This may take a moment.</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-md">
                <h3 className="font-bold text-red-800">An Error Occurred</h3>
                <p className="text-red-700 mt-2">{error}</p>
              </div>
            )}
            {!isLoading && !error && lessonPlan && (
              <div className="animate-text-focus-in">
                <LessonPlanDisplay plan={lessonPlan} />
              </div>
            )}
            {!isLoading && !error && !lessonPlan && (
               <div className="flex flex-col items-center justify-center bg-white p-12 rounded-2xl shadow-lg h-full text-center">
                  <SparklesIcon className="w-16 h-16 text-gray-300 mb-4" />
                  <h2 className="text-2xl font-semibold text-gray-700">Your Plan Awaits</h2>
                  <p className="text-gray-500 mt-2 max-w-md">Fill out the form to the left to generate a new project-based lesson plan with the power of AI.</p>
              </div>
            )}
          </div>
        </main>
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Powered by Google Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
