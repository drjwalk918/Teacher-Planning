import React, { useRef, useState } from 'react';
import { GraphicOrganizer } from '../types';
import { DownloadIcon, PencilIcon, MagnifyingGlassIcon, BookOpenIcon, LightBulbIcon, UsersIcon, CompareIcon, SparklesIcon } from './IconComponents';

interface GraphicOrganizerModalProps {
  organizer: GraphicOrganizer | null;
  onClose: () => void;
}

const iconMap = {
    Pencil: PencilIcon,
    MagnifyingGlass: MagnifyingGlassIcon,
    Book: BookOpenIcon,
    LightBulb: LightBulbIcon,
    Users: UsersIcon,
    Compare: CompareIcon,
};

const GraphicOrganizerModal: React.FC<GraphicOrganizerModalProps> = ({ organizer, onClose }) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<'PDF' | 'PNG' | null>(null);

  const handleDownload = async (type: 'PDF' | 'PNG') => {
    const element = slideRef.current;
    if (!element || !organizer) return;

    setDownloadType(type);
    setIsDownloading(true);

    try {
      const canvas = await window.html2canvas(element, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const fileName = `${organizer.title.replace(/\s+/g, '_').toLowerCase()}_organizer`;

      if (type === 'PNG') {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else { // PDF
        const { jsPDF } = window.jspdf;
        // Use landscape for 16:9 ratio
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4',
        });
        
        const pageMargin = 5;
        const pdfWidth = doc.internal.pageSize.getWidth() - pageMargin * 2;
        const pdfHeight = doc.internal.pageSize.getHeight() - pageMargin * 2;
        
        const imgData = canvas.toDataURL('image/png');
        
        const canvasAspectRatio = canvas.width / canvas.height;
        let finalWidth = pdfWidth;
        let finalHeight = finalWidth / canvasAspectRatio;

        if (finalHeight > pdfHeight) {
          finalHeight = pdfHeight;
          finalWidth = finalHeight * canvasAspectRatio;
        }

        const x = (doc.internal.pageSize.getWidth() - finalWidth) / 2;
        const y = (doc.internal.pageSize.getHeight() - finalHeight) / 2;

        doc.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        doc.save(`${fileName}.pdf`);
      }
    } catch (err) {
      console.error(`Failed to download ${type}`, err);
      alert(`Could not download the ${type}. Please try again.`);
    } finally {
      setIsDownloading(false);
      setDownloadType(null);
    }
  };

  if (!organizer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-text-focus-in" style={{ animationDuration: '0.3s' }}>
      <div className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col">
        <header className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Graphic Organizer Preview</h2>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
                onClick={() => handleDownload('PNG')}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-wait"
            >
                {isDownloading && downloadType === 'PNG' ? '...' : <DownloadIcon className="w-5 h-5" />}
                <span className="hidden sm:inline">Download PNG</span>
            </button>
            <button
                onClick={() => handleDownload('PDF')}
                disabled={isDownloading}
                className="inline-flex items-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-wait"
            >
                {isDownloading && downloadType === 'PDF' ? '...' : <DownloadIcon className="w-5 h-5" />}
                 <span className="hidden sm:inline">Download PDF</span>
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-200 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-8 overflow-auto flex-grow flex items-center justify-center">
          {/* Slide container with 16:9 aspect ratio */}
          <div ref={slideRef} className="w-full max-w-[1000px] aspect-[16/9] bg-white shadow-xl rounded-lg p-8 lg:p-12 flex flex-col font-sans">
              {/* Slide Header */}
              <header className="w-full flex-shrink-0 border-b-2 border-indigo-500 pb-4 mb-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">{organizer.title}</h1>
                <p className="text-lg text-gray-600 mt-2">{organizer.instructions}</p>
              </header>

              {/* Slide Body */}
              <div className="flex-grow w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 overflow-hidden">
                {organizer.sections.map((section, index) => {
                  const IconComponent = iconMap[section.iconName] || PencilIcon;
                  const layoutClass = section.layout === 'Grid' ? `grid grid-cols-2 gap-3` :
                                      section.layout === 'TwoColumn' ? `grid grid-cols-2 gap-4` :
                                      `flex flex-col gap-3`;
                  
                  return (
                    <section key={index} className="flex flex-col">
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2.5 text-gray-700">
                        <span className="bg-indigo-100 rounded-full p-1.5">
                          <IconComponent className="w-6 h-6 text-indigo-600" />
                        </span>
                        {section.sectionTitle}
                      </h3>
                      <div className={`flex-grow ${layoutClass}`}>
                        {section.fields.map((field, fIndex) => (
                          <div key={fIndex} className="bg-slate-50/70 rounded-md border-2 border-dashed border-slate-300 p-3 flex flex-col justify-start">
                              <label className="text-sm font-medium text-slate-600">{field}</label>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* Slide Footer */}
              <footer className="w-full mt-auto pt-4 text-right flex-shrink-0">
                <p className="text-xs text-gray-400 flex items-center justify-end gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-indigo-400"/>
                  Generated by AI Lesson Planner
                </p>
              </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GraphicOrganizerModal;
