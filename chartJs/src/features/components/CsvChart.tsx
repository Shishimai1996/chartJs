import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { useCsvParser } from "@/src/hooks/useCsvParser";
import { Bar } from "react-chartjs-2";
import type { ChartData } from "chart.js";
import { AggregatedData, TCourse } from "@/src/types/types";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function CsvChart() {
  const [data, setData] = useState<AggregatedData>();
  const [courseData, setCourseData] = useState<TCourse>();

  const { fileInputRef, handleFileChange, triggerFileSelect } = useCsvParser(
    (ageData, courseData) => {
      setData(ageData);
      setCourseData(courseData);
    }
  );

  const chartData: ChartData<"bar", number[], string> = {
    labels: ["1950's", "1960's", "1970's", "1980's", "1990's", "2000's"],
    datasets: [
      {
        label: "The Number of Users by age group",
        data: data ? Object.values(data) : [],
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const chartDataByCourse: ChartData<"bar", number[], string> = {
    labels: ["1", "2", "3", "4"],
    datasets: [
      {
        label: "The Number of Courses use take",
        data: courseData ? Object.values(courseData) : [],
        backgroundColor: "rgba(192, 75, 174, 0.6)",
      },
    ],
  };
  return (
    <div>
      <button onClick={triggerFileSelect}>Select CSV file</button>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      {data && Object.values(data).some((val) => val > 0) && (
        <div style={{ width: "600px", marginTop: "2rem" }}>
          <Bar data={chartData} />
        </div>
      )}

      {courseData && Object.values(courseData).some((val) => val > 0) && (
        <div style={{ width: "600px", marginTop: "2rem" }}>
          <Bar data={chartDataByCourse} />
        </div>
      )}
    </div>
  );
}
