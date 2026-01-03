'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CustomMeasurementForm() {
  const [measurements, setMeasurements] = useState({
    shoulder: '',
    aboveBust: '',
    underbust: '',
    nextDepthBack: '',
    blouseWaist: '',
    sleevelength: '',
    armhole: '',
    bicep: '',
    nextDepthFront: '',
    nextDepthBackLower: '',
    lehengaWaist: '',
    hips: '',
    lehengaLength: '',
    specialInstructions: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMeasurements({
      ...measurements,
      [e.target.name]: e.target.value,
    });
  };

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
            <label className="text-xs uppercase tracking-wide w-48">ABOVE BUST:</label>
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
            <label className="text-xs uppercase tracking-wide w-48">NEXT DEPTH BACK</label>
            <input
              type="text"
              name="nextDepthBack"
              value={measurements.nextDepthBack}
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
            <label className="text-xs uppercase tracking-wide w-48">SLEEVELENGTH</label>
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
            <label className="text-xs uppercase tracking-wide w-48">NEXT DEPTH FRONT</label>
            <input
              type="text"
              name="nextDepthFront"
              value={measurements.nextDepthFront}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">NEXT DEPTH BACK</label>
            <input
              type="text"
              name="nextDepthBackLower"
              value={measurements.nextDepthBackLower}
              onChange={handleChange}
              className="border border-gray-300 px-2 py-1.5 w-16 focus:outline-none focus:border-black text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-xs uppercase tracking-wide w-48">LEHENGA/PALAZO WAIST</label>
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
            <label className="text-xs uppercase tracking-wide w-48">LEHENGA/PALAZO LENGTH WITH HEELS</label>
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
                unoptimized
              />
            </div>
            <div className="relative w-[200px] h-[300px]">
              <Image
                src="/size/custom_2.tiff"
                alt="Measurement Guide 2"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
          <div className="relative w-[200px] h-[300px]">
            <Image
              src="/size/custom_3.tiff"
              alt="Measurement Guide 3"
              fill
              className="object-contain"
              unoptimized
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
