import { useEffect, useState } from "react";
import moment from "moment";
import { TPost } from "./PostData";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: true,
      text: "the Number of created, merged, and closed PR",
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};
interface StackedBarChartProps {
  post: TPost[];
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ post }) => {
  const [create, setCreate] = useState<Date[]>([]);
  const [merge, setMerge] = useState<Date[]>([]);
  const [close, setClose] = useState<Date[]>([]);

  const [labels, setLabels] = useState<string[]>([]);
  useEffect(() => {
    if (post) {
      const countData: {
        created_at: Record<string, number>;
        merged_at: Record<string, number>;
        closed_at: Record<string, number>;
      } = {
        created_at: {},
        merged_at: {},
        closed_at: {},
      };

      post.forEach(
        (item: {
          created_at: moment.MomentInput;
          merged_at: moment.MomentInput;
          closed_at: moment.MomentInput;
        }) => {
          const createdDate = moment(item.created_at).format("YYYY-MM-DD");
          const mergedDate = moment(item.merged_at).format("YYYY-MM-DD");
          const closedDate = moment(item.closed_at).format("YYYY-MM-DD");

          countData.created_at[createdDate] =
            (countData.created_at[createdDate] || 0) + 1;
          countData.merged_at[mergedDate] =
            (countData.merged_at[mergedDate] || 0) + 1;
          countData.closed_at[closedDate] =
            (countData.closed_at[closedDate] || 0) + 1;
        }
      );

      const startDate = moment().subtract(3, "months");
      const endDate = moment();
      const dateLabels: string[] = [];
      let currentDatePointer = startDate.clone();
      while (currentDatePointer.isSameOrBefore(endDate)) {
        dateLabels.push(currentDatePointer.format("YYYY-MM-DD"));
        currentDatePointer.add(1, "days");
      }

      const createData = dateLabels.map((label) => {
        const timestamp = countData.created_at[label] || 0;
        return new Date(timestamp);
      });
      const mergeData = dateLabels.map((label) => {
        const timestamp = countData.merged_at[label] || 0;
        return new Date(timestamp);
      });
      const closeData = dateLabels.map((label) => {
        const timestamp =
          (countData.closed_at[label] || 0) - (countData.merged_at[label] || 0);
        return new Date(timestamp);
      });

      setCreate(createData);
      setMerge(mergeData);
      setClose(closeData);
      setLabels(dateLabels);
    }
  }, [post]);

  const dataSet = {
    labels: labels,
    datasets: [
      {
        label: "created_at",
        data: create,
        backgroundColor: "rgb(255, 99, 132)",
      },
      {
        label: "merged_at",
        data: merge,
        backgroundColor: "rgb(75, 192, 192)",
      },
      {
        label: "closed_at",
        data: close,
        backgroundColor: "rgb(53, 162, 235)",
      },
    ],
  };
  return <Bar options={options} data={dataSet} height={100} />;
};
