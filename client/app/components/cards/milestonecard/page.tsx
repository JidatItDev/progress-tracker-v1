"use client";

import { Milestone } from "@/app/pages/projects/[id]/page";
import { useEffect, useState } from "react";
import ButtonPink from "../../button/pinkbutton/page";
import { CirclePlus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import AddModal from "../../modal/submilestonemodal/page";
import AddDelayModal from "../../modal/delaymodal/page";

interface SubMilestone {
  id: number;
  title: string;
  progress: number;
}

const MilestoneCard = ({ milestone }: { milestone: Milestone }) => {
  const [showSubMilestones, setShowSubMilestones] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);

  // Sample sub-milestones
  const subMilestones: SubMilestone[] = [
    { id: 1, title: "Sub Milestone 1", progress: 56 },
    { id: 2, title: "Sub Milestone 2", progress: 93 },
    { id: 3, title: "Sub Milestone 3", progress: 85 },
  ];

  const milestoneProgress =
    subMilestones.length > 0
      ? Math.round(
          subMilestones.reduce((acc, sm) => acc + sm.progress, 0) /
            subMilestones.length
        )
      : milestone.progress;

  // Handle body scroll lock for any modal
  useEffect(() => {
    const isAnyModalOpen = isModalOpen || isDelayModalOpen;
    document.body.classList.toggle("modal-open", isAnyModalOpen);

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isModalOpen, isDelayModalOpen]);

  return (
    <div className="bg-white rounded-lg">
      {/* Main Milestone Card */}
      <div className="p-5 flex justify-between items-center">
        {/* Left */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{milestone.title}</h3>
            <span className="text-xs text-gray-400">📅 {milestone.date}</span>
          </div>

          <p className="text-sm text-gray-500 mb-3">{milestone.projectName}</p>

          <button
            onClick={() => setShowSubMilestones((prev) => !prev)}
            className="px-3 rounded-full bg-black text-white text-xs font-semibold flex items-center gap-1"
          >
            Sub Milestones
            {showSubMilestones ? <ChevronUp /> : <ChevronDown />}
          </button>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-2 w-1/3">
          <div className="flex justify-end px-2">
            <span
              className={`text-xs font-medium ${
                milestone.status === "active"
                  ? "text-green-500"
                  : "text-blue-600"
              }`}
            >
              • {milestone.status}
            </span>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-pink-500 h-4 rounded-full transition-all"
              style={{ width: `${milestoneProgress}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-end px-2 text-xs font-semibold">
              {milestoneProgress}%
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsDelayModalOpen(true)}
              className="px-1 py-1 w-30 border rounded-full bg-white text-black text-xs font-semibold hover:bg-gray-50"
            >
              Delay
            </button>
          </div>
        </div>
      </div>

      {/* Sub Milestones */}
      {showSubMilestones && (
        <div className="px-5 pb-5 pt-4 border-t space-y-3">
          <div className="flex justify-end">
            <ButtonPink
              buttonname="+ Add Sub-Milestone"
              className="bg-pink-600 hover:bg-pink-700 text-white px-2 py-1.5 rounded-md text-xs font-semibold"
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          {subMilestones.map((sub) => (
            <div key={sub.id} className="flex items-center gap-4 pl-4">
              <span className="text-sm text-gray-700 min-w-[140px]">
                {sub.title}
              </span>

              <div className="flex-1 max-w-md">
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-pink-500 h-3 rounded-full"
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
              </div>

              <span className="text-xs text-gray-600 w-10 text-right">
                {sub.progress}%
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  <CirclePlus size={14} />
                </button>
                <button className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && <AddModal onClose={() => setIsModalOpen(false)} />}

      {isDelayModalOpen && (
        <AddDelayModal onClose={() => setIsDelayModalOpen(false)} />
      )}
    </div>
  );
};

export default MilestoneCard;
