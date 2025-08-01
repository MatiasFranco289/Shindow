import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdStopwatch } from "react-icons/io";

interface CircularProgressBarProps {
  progress: number;
  size: number;
  strokeWidth: number;
  isUploadActive: boolean;
}

export default function CircularProgressBar({
  progress,
  size,
  strokeWidth,
  isUploadActive,
}: CircularProgressBarProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="inline-flex justify-center items-center">
      <svg style={{ width: `${size}px`, height: `${size}px` }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#064851"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="white"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>

      {isUploadActive ? (
        <MdOutlineFileUpload className="text-3xl absolute" />
      ) : (
        <svg width="33" height="10" className="absolute">
          <circle cx={4} cy={5} r="4" fill="#D9D9D9" />
          <circle cx={16} cy={5} r="4" fill="#D9D9D9" />
          <circle cx={28} cy={5} r="4" fill="#D9D9D9" />
        </svg>
      )}
    </div>
  );
}
