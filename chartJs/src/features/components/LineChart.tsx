"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TPost } from "./PostData";
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export const options: ChartOptions<"line"> = {
  scales: {
    x: {
      title: {
        display: true,
        text: "Week",
      },
    },
    y: {
      title: {
        text: "Days",
        display: true,
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Cycle Time",
    },
  },
};
interface LineChartProps {
  post: TPost[];
}
export const LineChart: React.FC<LineChartProps> = (post): JSX.Element => {
  const [duration, setDuration] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      const currentDate = new Date();
      const threeMonthsAgo = new Date(currentDate);
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
      const filteredData = Object.values(post.post).filter((value) => {
        return (
          value.merged_at !== null &&
          !isNaN(new Date(value.merged_at).getTime()) &&
          new Date(value.merged_at) >= threeMonthsAgo
        );
      });
      const groupedData: Record<string, number[]> = {};

      filteredData.forEach((value: any) => {
        const createMoment = moment(value.created_at);
        const mergeMoment = moment(value.merged_at);
        const diffDays = mergeMoment.diff(createMoment, "days");
        const weekStart = mergeMoment.startOf("week").format("YYYY-MM-DD");

        if (!groupedData[weekStart]) {
          groupedData[weekStart] = [];
        }
        groupedData[weekStart].push(diffDays);
      });

      const averages: number[] = [];
      let currentWeekStart = moment().subtract(3, "months").startOf("week");
      const labels: string[] = [];

      while (currentWeekStart.isSameOrBefore(moment(), "week")) {
        const weekStart = currentWeekStart.format("YYYY-MM-DD");
        labels.push(weekStart);

        labels.sort((a, b) => moment(a).valueOf() - moment(b).valueOf());

        if (groupedData[weekStart]) {
          const group = groupedData[weekStart].map(Number);
          const total = group.reduce((acc, val) => acc + val, 0);
          const average = total / group.length;
          averages.push(average);
        } else {
          averages.push(0);
        }
        currentWeekStart.add(1, "week");
      }

      setDuration(averages);
      setLabels(labels);
    }
  }, [post]);

  const data: ChartData<"line"> = {
    labels: labels,
    datasets: [
      {
        label: "duration",
        data: duration,
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 2,
        pointRadius: 2,
        pointHitRadius: 10,
        fill: false,
      },
    ],
  };

  return <Line options={options} data={data} height={100} />;
};
