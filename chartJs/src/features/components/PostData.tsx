import React, { useEffect, useState } from "react";
import axios from "axios";
import { StackedBarChart } from "./StackedBarChart";
import moment from "moment";
import { HorizontalBarChart } from "./HorizontalBarChart";
import { LineChart } from "./LineChart";
import { BarChart } from "./BarChart";

const baseURL = "http://localhost:3002/api/posgres";

export type TPost = {
  author_association: string;
  auto_merge: null;
  body: string;
  closed_at: Date;
  created_at: Date;
  draft: boolean;
  id: string;
  labels: string;
  locked: boolean;
  merged_at: Date;
  number: number;
  pull_request_id: string;
  state: string;
  title: string;
  updated_at: string;
  url: string;
  user: string;
};
interface PostDataProps {
  onPostData: (post: TPost[]) => void;
}
function PostData({ onPostData }: PostDataProps) {
  const [post, setPost] = useState<TPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<TPost[]>(baseURL);
        const updatedPost = response.data.map((item) => {
          return {
            ...item,
            created_at: moment(item.created_at).toDate(),
            merged_at: moment(item.merged_at).toDate(),
            closed_at: moment(item.closed_at).toDate(),
          };
        });
        updatedPost.forEach((item) => {
          item.created_at = new Date(item.created_at);
          item.merged_at = new Date(item.merged_at);
          item.closed_at = new Date(item.closed_at);
        });

        setPost(updatedPost);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div style={{ margin: "10px" }}>
        <StackedBarChart post={post} />
      </div>
      <div style={{ margin: "10px" }}>
        <HorizontalBarChart post={post} />
      </div>
      <div style={{ margin: "10px" }}>
        <LineChart post={post} />
      </div>
      <div style={{ margin: "10px" }}>
        <BarChart post={post} />
      </div>
    </div>
  );
}

export default PostData;
