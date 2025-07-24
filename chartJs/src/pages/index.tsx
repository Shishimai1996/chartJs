// import PostData, { TPost } from "../features/components/PostData";
// import { useState } from "react";

import CsvChart from "../features/components/CsvChart";

export default function Home() {
  // const [data, setData] = useState<{ post: TPost[] }>({ post: [] });
  // const handlePostData = (post: TPost[]) => {
  //   setData({ post: post });
  // };

  return (
    <>
      <h1>Chart</h1>
      <CsvChart />
      {/* <PostData onPostData={(post: TPost[]) => handlePostData(post)} /> */}
    </>
  );
}
