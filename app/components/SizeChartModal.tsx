'use client';

import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import Image from 'next/image';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export default function SizeChartModal({ isOpen, onClose, productName }: SizeChartModalProps) {
  const [unit, setUnit] = useState<'cm' | 'inches'>('cm');

  if (!isOpen) return null;

  const sizeDataCm = [
    { size: 'XS', bust: '81.3', waist: '63.5', hip: '86.4' },
    { size: 'S', bust: '86.4', waist: '66', hip: '91.4' },
    { size: 'M', bust: '91.4', waist: '71.1', hip: '96.5' },
    { size: 'L', bust: '96.5', waist: '76.2', hip: '102' },
    { size: 'XL', bust: '102', waist: '81.3', hip: '107' },
    { size: 'XXL', bust: '107', waist: '86.4', hip: '112' },
  ];

  const sizeDataInches = [
    { size: 'XS', bust: '32', waist: '25', hip: '34' },
    { size: 'S', bust: '34', waist: '26', hip: '36' },
    { size: 'M', bust: '36', waist: '28', hip: '38' },
    { size: 'L', bust: '38', waist: '30', hip: '40' },
    { size: 'XL', bust: '40', waist: '32', hip: '42' },
    { size: 'XXL', bust: '42', waist: '34', hip: '44' },
  ];

  const currentData = unit === 'cm' ? sizeDataCm : sizeDataInches;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <IoClose size={32} />
        </button>

        {/* Header */}
        <div className="border-b px-8 py-6">
          <h2 className="text-2xl font-light tracking-wider uppercase">{productName}</h2>
          <p className="text-sm text-gray-600 mt-1">Size Charts</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Unit Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setUnit('cm')}
              className={`text-sm uppercase tracking-wider pb-2 ${
                unit === 'cm'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-400'
              }`}
            >
              CM
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setUnit('inches')}
              className={`text-sm uppercase tracking-wider pb-2 ${
                unit === 'inches'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-400'
              }`}
            >
              INCHES
            </button>
          </div>

          {/* Size Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="py-4 px-6 text-left font-medium uppercase tracking-wider"></th>
                  <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">BUST</th>
                  <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">WAIST</th>
                  <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">HIP</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <tr key={row.size} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-4 px-6 font-medium">{row.size}</td>
                    <td className="py-4 px-6 text-center">{row.bust}</td>
                    <td className="py-4 px-6 text-center">{row.waist}</td>
                    <td className="py-4 px-6 text-center">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Measurement Diagram */}
          <div className="mt-8">
            <Image
              src="/size/sizechart.webp"
              alt="Measurement Guide"
              width={800}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
