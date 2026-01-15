"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface DelayModalProps {
  onClose: () => void;
}

const DelayModal = ({ onClose }: DelayModalProps) => {
  const [delayReason, setDelayReason] = useState("");
  const [delayDays, setDelayDays] = useState("");

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!delayReason || !delayDays) {
      alert("Please fill in all fields");
      return;
    }

    const delayData = {
      delayReason,
      delayDays,
    };

    console.log("Delay Created:", delayData);

    toast.success("Delay added successfully!");

    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-xl w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Delay Reason */}
            <div className="flex flex-col">
              <label className="text-sm font-normal text-gray-800 mb-2.5">
                Delay Reason
              </label>
              <input
                type="text"
                value={delayReason}
                onChange={(e) => setDelayReason(e.target.value)}
                placeholder="Enter..."
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>

            {/* Enter Days */}
            <div className="flex flex-col">
              <label className="text-sm font-normal text-gray-800 mb-2.5">
                Enter Days
              </label>
              <input
                type="text"
                value={delayDays}
                onChange={(e) => setDelayDays(e.target.value)}
                placeholder="Select Days"
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1 border border-gray-300 text-sm font-normal text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-md bg-pink-600 px-3 py-1 text-sm font-normal text-white hover:bg-pink-700 transition-colors"
            >
             + Add Delay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelayModal;