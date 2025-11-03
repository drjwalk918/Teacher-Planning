import React from 'react';
import { GradingRubric } from '../types';

interface GradingRubricDisplayProps {
  rubric: GradingRubric;
}

const levelHeaders = [
    { name: 'Exemplary (4)', color: 'bg-green-100 text-green-800' },
    { name: 'Proficient (3)', color: 'bg-blue-100 text-blue-800' },
    { name: 'Developing (2)', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Beginning (1)', color: 'bg-red-100 text-red-800' },
];

const GradingRubricDisplay: React.FC<GradingRubricDisplayProps> = ({ rubric }) => {
  return (
    <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-sm">
      <h4 className="text-xl font-bold text-gray-800 mb-4">{rubric.title}</h4>
      <div className="border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                Criterion
              </th>
              {levelHeaders.map(header => (
                 <th key={header.name} scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${header.color}`}>
                    {header.name}
                 </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rubric.criteria.map((criterion, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 align-top">
                  {criterion.criterion}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 align-top">
                  {criterion.levels.exemplary}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 align-top">
                  {criterion.levels.proficient}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 align-top">
                  {criterion.levels.developing}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 align-top">
                  {criterion.levels.beginning}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradingRubricDisplay;