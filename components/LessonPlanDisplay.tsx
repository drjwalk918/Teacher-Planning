import React, { useRef, useState } from 'react';
import { LessonPlan, DailyPlan, GraphicOrganizer } from '../types';
import { generateGraphicOrganizer } from '../services/geminiService';
import GraphicOrganizerModal from './GraphicOrganizerModal';
import GradingRubricDisplay from './GradingRubricDisplay';
import { BookOpenIcon, VideoCameraIcon, CollectionIcon, LightBulbIcon, UsersIcon, ChatAlt2Icon, SparklesIcon, ClipboardCheckIcon, DownloadIcon, AcademicCapIcon } from './IconComponents';

interface LessonPlanDisplayProps {
  plan: LessonPlan;
}

// Declare types for CDN-loaded libraries to satisfy TypeScript
declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}

const FourCIcon: React.FC<{ c: 'collaboration' | 'communication' | 'criticalThinking' | 'creativity' }> = ({ c }) => {
  switch (c) {
    case 'collaboration': return <UsersIcon className="w-6 h-6 text-blue-500" />;
    case 'communication': return <ChatAlt2Icon className="w-6 h-6 text-green-500" />;
    case 'criticalThinking': return <LightBulbIcon className="w-6 h-6 text-yellow-500" />;
    case 'creativity': return <SparklesIcon className="w-6 h-6 text-purple-500" />;
    default: return null;
  }
};


const DailyPlanCard: React.FC<{ 
  dailyPlan: DailyPlan,
  onGenerateOrganizer: (description: string, topic: string, day: number) => void,
  isGeneratingForDay: number | null
}> = ({ dailyPlan, onGenerateOrganizer, isGeneratingForDay }) => {
    const isGenerating = isGeneratingForDay === dailyPlan.day;
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 transition-shadow hover:shadow-lg">
        <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-100 text-indigo-700 font-bold rounded-full w-12 h-12 flex items-center justify-center text-xl">
                {dailyPlan.day}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{dailyPlan.topic}</h3>
            </div>
            
            <div className="space-y-4">
                <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Activities</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 pl-2">
                    {dailyPlan.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                </ul>
                </div>

                <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3 mt-4">4 C's Integration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <FourCIcon c="collaboration" />
                        <div><span className="font-semibold text-blue-700">Collaboration:</span> <span className="text-gray-600">{dailyPlan.fourCs.collaboration}</span></div>
                    </div>
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <FourCIcon c="communication" />
                        <div><span className="font-semibold text-green-700">Communication:</span> <span className="text-gray-600">{dailyPlan.fourCs.communication}</span></div>
                    </div>
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <FourCIcon c="criticalThinking" />
                        <div><span className="font-semibold text-yellow-700">Critical Thinking:</span> <span className="text-gray-600">{dailyPlan.fourCs.criticalThinking}</span></div>
                    </div>
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <FourCIcon c="creativity" />
                        <div><span className="font-semibold text-purple-700">Creativity:</span> <span className="text-gray-600">{dailyPlan.fourCs.creativity}</span></div>
                    </div>
                </div>
                </div>

                <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3 mt-4">Resources</h4>
                <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <CollectionIcon className="w-5 h-5 mt-1 text-teal-600 flex-shrink-0" />
                            <div>
                                <span className="font-semibold">Graphic Organizer:</span> {dailyPlan.resources.graphicOrganizer}
                                <button
                                    onClick={() => onGenerateOrganizer(dailyPlan.resources.graphicOrganizer, dailyPlan.topic, dailyPlan.day)}
                                    disabled={isGenerating}
                                    className="ml-2 mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-wait transition-colors"
                                >
                                    {isGenerating ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-4 h-4" />
                                            Create & Download
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-start gap-3"><BookOpenIcon className="w-5 h-5 mt-1 text-orange-600 flex-shrink-0" /><div><span className="font-semibold">Reading Prompt:</span> {dailyPlan.resources.readingPrompt}</div></div>
                        <div className="flex items-start gap-3">
                            <VideoCameraIcon className="w-5 h-5 mt-1 text-rose-600 flex-shrink-0" />
                            <div>
                                <span className="font-semibold">Video Instruction:</span>{' '}
                                <a 
                                    href={dailyPlan.resources.videoInstruction.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-indigo-600 hover:text-indigo-800 underline transition-colors"
                                >
                                    {dailyPlan.resources.videoInstruction.description}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};


const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({ plan }) => {
  const printableContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [modalOrganizer, setModalOrganizer] = useState<GraphicOrganizer | null>(null);
  const [isGeneratingOrganizer, setIsGeneratingOrganizer] = useState<boolean>(false);
  const [organizerForDay, setOrganizerForDay] = useState<number | null>(null);
  const [organizerError, setOrganizerError] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    const container = printableContentRef.current;
    if (!container) return;

    setIsDownloading(true);

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      
      const canvasOptions = {
        scale: 2,
        useCORS: true,
        backgroundColor: '#f9fafb', // Match parent bg-gray-50
      };

      const addImageToPdf = (canvas: HTMLCanvasElement, pdfDoc: any) => {
        const pageMargin = 15;
        const pdfWidth = pdfDoc.internal.pageSize.getWidth();
        const pdfHeight = pdfDoc.internal.pageSize.getHeight();
        
        const contentWidth = pdfWidth - (pageMargin * 2);
        const contentHeight = pdfHeight - (pageMargin * 2);

        const imgData = canvas.toDataURL('image/png');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const canvasAspectRatio = canvasWidth / canvasHeight;

        let finalImgWidth = contentWidth;
        let finalImgHeight = finalImgWidth / canvasAspectRatio;

        if (finalImgHeight > contentHeight) {
          finalImgHeight = contentHeight;
          finalImgWidth = finalImgHeight * canvasAspectRatio;
        }

        const x = (pdfWidth - finalImgWidth) / 2;
        const y = pageMargin;

        pdfDoc.addImage(imgData, 'PNG', x, y, finalImgWidth, finalImgHeight);
      };

      const firstPageElement = container.querySelector<HTMLElement>('#pdf-first-page');
      if (firstPageElement) {
        const canvas = await window.html2canvas(firstPageElement, canvasOptions);
        addImageToPdf(canvas, doc);
      }
      
      const rubricElement = container.querySelector<HTMLElement>('.rubric-page-wrapper');
      if (rubricElement) {
        const canvas = await window.html2canvas(rubricElement, canvasOptions);
        doc.addPage();
        addImageToPdf(canvas, doc);
      }

      const dailyPlanElements = container.querySelectorAll<HTMLElement>('.daily-plan-page-wrapper');
      for (const element of Array.from(dailyPlanElements)) {
        const canvas = await window.html2canvas(element, canvasOptions);
        doc.addPage();
        addImageToPdf(canvas, doc);
      }

      doc.save('pbl-lesson-plan.pdf');
    } catch (error) {
      console.error("Could not generate PDF: ", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateOrganizer = async (description: string, topic: string, day: number) => {
    setIsGeneratingOrganizer(true);
    setOrganizerForDay(day);
    setOrganizerError(null);
    try {
        const organizerData = await generateGraphicOrganizer(description, topic);
        setModalOrganizer(organizerData);
    } catch (error) {
        setOrganizerError("Sorry, we couldn't generate the graphic organizer. Please try again.");
        // Simple alert for now, could be a toast notification
        alert("Sorry, we couldn't generate the graphic organizer. Please try again.");
    } finally {
        setIsGeneratingOrganizer(false);
        setOrganizerForDay(null);
    }
  };


  return (
    <>
    <GraphicOrganizerModal 
        organizer={modalOrganizer}
        onClose={() => setModalOrganizer(null)}
    />
    <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
      <div ref={printableContentRef}>
        <div id="pdf-first-page">
            <header className="mb-8 text-center border-b pb-6">
            <h2 className="text-4xl font-extrabold text-indigo-700 tracking-wide">{plan.title}</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">{plan.overview}</p>
            <p className="mt-2 text-sm font-medium text-gray-500">Duration: {plan.duration}</p>
            </header>

            <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ClipboardCheckIcon className="w-7 h-7 text-indigo-500" />
                Learning Objectives
            </h3>
            <ul className="space-y-2 list-disc list-inside bg-white p-5 rounded-lg shadow-sm">
                {plan.learningObjectives.map((objective, index) => (
                <li key={index} className="text-gray-700">{objective}</li>
                ))}
            </ul>
            </section>
        </div>
        
        {plan.gradingRubric && (
          <div className="rubric-page-wrapper mt-8">
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <AcademicCapIcon className="w-7 h-7 text-indigo-500" />
                Project Grading Rubric
              </h3>
              <GradingRubricDisplay rubric={plan.gradingRubric} />
            </section>
          </div>
        )}

        <section className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Daily Breakdown</h3>
          <div>
            {plan.dailyBreakdown.sort((a, b) => a.day - b.day).map(dailyPlan => (
                <div key={dailyPlan.day} className="daily-plan-page-wrapper">
                    <DailyPlanCard 
                        dailyPlan={dailyPlan} 
                        onGenerateOrganizer={handleGenerateOrganizer}
                        isGeneratingForDay={organizerForDay}
                    />
                </div>
            ))}
          </div>
        </section>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
          aria-label="Download lesson plan as PDF"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <DownloadIcon className="w-5 h-5" />
              Download Plan as PDF
            </>
          )}
        </button>
      </div>
    </div>
    </>
  );
};

export default LessonPlanDisplay;
