import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useState } from "react";

const ProgressBar = ({progressValue, onChangeComplete }: any) => {
  const [progress, setProgress] = useState<any>(progressValue || 0);

  const handleChange = (value: any) => {
    setProgress(value);
  };
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900">
        Progress
      </label>
      <Slider onChangeComplete={() => onChangeComplete(progress)}
        min={0}
        max={100}
        value={progress}
        onChange={(value) => handleChange(value)}
        railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
        trackStyle={{ backgroundColor: "#3b82f6", height: 6 }}
        handleStyle={{
          borderColor: "#3b82f6",
          height: 20,
          width: 20,
          marginTop: -7,
          backgroundColor: "#3b82f6",
        }}
      />
      <div className="mt-2 text-sm text-gray-400">{progress}%</div>
    </div>
  );
}

export default ProgressBar
