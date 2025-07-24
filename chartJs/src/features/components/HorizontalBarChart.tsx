import { useEffect, useState } from "react";
import moment, { MomentInput } from "moment";
import { TPost } from "./PostData";
import "chartjs-adapter-date-fns";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions,
} from "chart.js";
ChartJS.register(TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options: ChartOptions<"bar"> = {
  indexAxis: "y" as const,
  scales: {
    x: {
      type: "time",
      time: {
        parser: "x",
        unit: "day",
        tooltipFormat: "yyyy-MM-dd",
        displayFormats: {
          day: "yyyy-MM-dd",
        },
      },
      title: {
        display: true,
        text: "Date",
      },
      min: moment().subtract(3, "months").startOf("day").valueOf(),
      max: moment().startOf("day").valueOf(),
    },

    y: {
      title: {
        display: true,
        text: "PR",
      },
    },
  },
  //type: "bar",
  responsive: true,
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem: TooltipItem<"bar">) {
          const dataset = tooltipItem.dataset as {
            label: string;
          };
          const raw = tooltipItem.raw as Date[];
          let label = dataset.label || "";
          if (label) {
            label += ": ";
          }
          const startValue = raw[0];
          const endValue = raw[1];

          const startDate = moment(startValue).format("YYYY-MM-DD");
          const endDate = moment(endValue).format("YYYY-MM-DD");
          label += `${startDate} to ${endDate}`;
          return label;
        },
      },
    },

    legend: {
      position: "bottom" as "bottom",
    },
    title: {
      display: true,
      text: "the Time to Merge PR",
    },
  },
};
interface HorizontalBarChartProps {
  post: TPost[];
}
export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  post,
}) => {
  const [create, setCreate] = useState<Date[][]>([]);
  const [labels, setLabels] = useState<number[]>([]);

  useEffect(() => {
    if (post) {
      const filteredData = Object.values(post).filter((value) => {
        return (
          value.merged_at !== null &&
          !isNaN(new Date(value.merged_at).getTime())
        );
      });
      const sortedData = filteredData.sort((a, b) => a.number - b.number);

      const numbers = Object.values(sortedData).map((value) => value.number);

      const createData = sortedData.map(
        (value: { merged_at: Date; created_at: Date }) => {
          return [
            moment(value.created_at).toDate(),
            moment(value.merged_at).toDate(),
          ];
        }
      );

      setLabels(numbers);
      setCreate(createData);
    }
  }, [post]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "created",
        data: create,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} height={100} />;
};
