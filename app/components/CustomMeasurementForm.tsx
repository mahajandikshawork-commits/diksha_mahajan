'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CustomMeasurementFormProps {
  onMeasurementsChange?: (measurements: Record<string, string>) => void;
}

export default function CustomMeasurementForm({ onMeasurementsChange }: CustomMeasurementFormProps) {
  const [measurements, setMeasurements] = useState({
    shoulder: '',
    aboveBust: '',
    underbust: '',
    neckDepthBack: '',
    blouseWaist: '',
    sleevelength: '',
    armhole: '',
    bicep: '',
    neckDepthFront: '',
    neckDepthBackLower: '',
    lehengaWaist: '',
    hips: '',
    lehengaLength: '',
    specialInstructions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newMeasurements = {
      ...measurements,
      [e.target.name]: e.target.value,
    };
    setMeasurements(newMeasurements);
    
    // Notify parent component of changes
    if (onMeasurementsChange) {
      onMeasurementsChange(newMeasurements);
    }
  };

  // Notify parent on mount
  useEffect(() => {
    if (onMeasurementsChange) {
      onMeasurementsChange(measurements);
    }
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
        {/* Measurements Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">SHOULDER</label>
            <input
              type="text"
              name="shoulder"
              value={measurements.shoulder}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">ABOVE BUST</label>
            <input
              type="text"
              name="aboveBust"
              value={measurements.aboveBust}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">UNDERBUST</label>
            <input
              type="text"
              name="underbust"
              value={measurements.underbust}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">NECK DEPTH BACK</label>
            <input
              type="text"
              name="neckDepthBack"
              value={measurements.neckDepthBack}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">BLOUSE WAIST</label>
            <input
              type="text"
              name="blouseWaist"
              value={measurements.blouseWaist}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">SLEEVE LENGTH</label>
            <input
              type="text"
              name="sleevelength"
              value={measurements.sleevelength}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">ARMHOLE</label>
            <input
              type="text"
              name="armhole"
              value={measurements.armhole}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">BICEP</label>
            <input
              type="text"
              name="bicep"
              value={measurements.bicep}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">NECK DEPTH FRONT</label>
            <input
              type="text"
              name="neckDepthFront"
              value={measurements.neckDepthFront}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">NECK DEPTH BACK LOWER</label>
            <input
              type="text"
              name="neckDepthBackLower"
              value={measurements.neckDepthBackLower}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">LEHENGA/PANT WAIST</label>
            <input
              type="text"
              name="lehengaWaist"
              value={measurements.lehengaWaist}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">HIPS</label>
            <input
              type="text"
              name="hips"
              value={measurements.hips}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">LEHENGA/PANT LENGTH WITH HEELS</label>
            <input
              type="text"
              name="lehengaLength"
              value={measurements.lehengaLength}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>
        </div>

        {/* Images Column - Desktop Only */}
        <div className="hidden md:flex flex-col gap-4 items-center sticky top-32">
          <div className='flex flex-row gap-4'>
            <div className="relative w-[200px] h-[300px]">
              <Image
                src="/size/custom_1.tiff"
                alt="Measurement Guide 1"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative w-[200px] h-[300px]">
              <Image
                src="/size/custom_2.tiff"
                alt="Measurement Guide 2"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="relative w-[200px] h-[300px]">
            <Image
              src="/size/custom_3.tiff"
              alt="Measurement Guide 3"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="mt-6">
        <label className="text-xs uppercase tracking-wide block mb-2">SPECIAL INSTRUCTIONS</label>
        <textarea
          name="specialInstructions"
          value={measurements.specialInstructions}
          onChange={handleChange}
          rows={4}
          className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black resize-none text-sm"
        />
      </div>
    </div>
  );
}
