import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaticBox from '../component/StaticBox';
import VideoTable from '../component/VideoTable';

interface DashboardProps {
  topic: string;
}

interface TableData {
  id: string;
  name: string;
  Date_modified: string;
  duration: string;
  view: number;
  like: number;
  comment: number;
}

interface TopicData {
  topic: string;
  TotalVideo: number;
  AveView: number;
  AveLike: number;
  AveComment: number;
  table: TableData[];
}
const MockTopicData = {
  topic: 'Education',
  TotalVideo: 10,
  AveView: 10,
  AveLike: 10,
  AveComment: 10,
  table: [{ id: '12345', name: 'A', Date_modified: 'string', duration: 'string', view: 1, like: 1, comment: 1 }],
};

const Dashboard: React.FC<DashboardProps> = ({ topic }) => {
  const [topicData, setTopicData] = useState<TopicData>(MockTopicData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/dashboard/${topic}`);
        setTopicData(response.data);
      } catch (error) {
        console.error('Error fetching topic data:', error);
      }
    };
    fetchData();
  }, [topic]);

  if (!topicData) {
    return <div className="flex h-screen w-full items-center justify-center bg-background text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full flex-col space-y-12 overflow-auto bg-background p-2">
      <p className="ml-8 mt-20 text-3xl font-bold">Over View for Topic: {topic}</p>
      <div className="mt-auto flex justify-center space-x-12">
        <StaticBox title="Total Videos" value={topicData.TotalVideo} />
        <StaticBox title="Average Views" value={topicData.AveView} />
        <StaticBox title="Average Likes" value={topicData.AveLike} />
        <StaticBox title="Average Comments" value={topicData.AveComment} />
      </div>

      <VideoTable table_data={topicData.table} />
    </div>
  );
};

export default Dashboard;
