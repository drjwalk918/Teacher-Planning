
import React, { useState } from 'react';
import { LessonPlanFormParams } from '../types';

interface LessonPlanFormProps {
  onSubmit: (params: LessonPlanFormParams) => void;
  isLoading: boolean;
}

const LessonPlanForm: React.FC<LessonPlanFormProps> = ({ onSubmit, isLoading }) => {
  const [days, setDays] = useState<number>(5);
  const [subject, setSubject] = useState<string>('8th Grade Science');
  const [gradeLevel, setGradeLevel] = useState<string>('8th Grade');
  const [standard, setStandard] = useState<string>('PS1.A.4: The structure and properties of matter.');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!days || !subject || !gradeLevel || !standard) {
      setError('All fields are required.');
      return;
    }
    if (days < 1 || days > 20) {
      setError('Number of days must be between 1 and 20.');
      return;
    }
    setError('');
    onSubmit({ days, subject, gradeLevel, standard });
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg sticky top-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Lesson Plan Details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">
            Number of Days
          </label>
          <input
            type="number"
            id="days"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            min="1"
            max="20"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., 8th Grade Science"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Grade Level
          </label>
          <input
            type="text"
            id="gradeLevel"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            placeholder="e.g., 8th Grade"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="standard" className="block text-sm font-medium text-gray-700 mb-1">
            Oklahoma Academic Standard
          </label>
          <textarea
            id="standard"
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            rows={4}
            placeholder="Enter the specific academic standard code and description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isLoading}
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Plan'
          )}
        </button>
      </form>
    </div>
  );
};

export default LessonPlanForm;
