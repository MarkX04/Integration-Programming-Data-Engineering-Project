import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoTable from '../component/VideoTable';
// import mock_video_data from '../assets/mock_table_data';
// import mock_channel_data from '../assets/mock_channel_data';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface ChannelData {
  id: string;
  title: string;
  description: string;
  subscriber: number;
  view: number;
  video: number;
  like: number;
  comment: number;
  videos: VideoData[];
}

interface VideoData {
  id: string;
  name: string;
  Date_modified: string;
  duration: string;
  view: number;
  like: number;
  comment: number;
}

const ChannelAnalyze: React.FC = () => {
  const { channelID } = useParams();
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/channel_details/${channelID}`);
        setChannel(response.data);
      } catch (error) {
        console.error('Error fetching channel details:', error);
      }
    };
    fetchData();
  }, [channelID]);

  if (!channel) {
    return <div className="flex h-screen w-full items-center justify-center bg-background text-black">Loading...</div>;
  }

  // const [channel, setChannel] = useState(mock_channel_data);

  const handleButtonClick1 = () => {
    navigate(`/graph/${channel.id}`); // Replace '/analysis-page' with your desired route
  };
  const handleButtonClick2 = () => {
    navigate(`/export/${channel.id}`, { state: channel.videos });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <div className="min-h-screen w-full flex-col overflow-auto bg-background p-2">
      <p className="ml-8 mt-20 text-3xl font-bold">Channel Information</p>
      <div className="flex flex-row items-center justify-center space-y-2 overflow-auto bg-background">
        <div className="relative mt-10 flex-col gap-10">
          <div className="border-blue-500 ml-28 flex h-auto w-4/5 flex-col rounded-lg border-2 bg-white p-6 text-black shadow-lg">
            <div className="mb-4 flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>

              <h2 className="text-xl font-bold uppercase">Channel</h2>
            </div>

            <h3 className="text-lg font-semibold">
              <Link to={`/channel-analyze/${channel.id}`}>{channel.title}</Link>
            </h3>

            <div className="mt-6 flex w-full max-w-xl flex-col space-y-2">
              <p className={`text-black ${isExpanded ? '' : 'truncate'}`}>Description: {channel.description}</p>
              <button onClick={toggleExpanded} className="item-left text-gray-600 hover:text-black hover:underline">
                {isExpanded ? 'See less' : 'See more'}
              </button>

              <p>{channel.subscriber} subscribers</p>
              <p>{channel.video} videos</p>
              <p>{channel.view} views</p>
              <p>Total likes: {channel.like}</p>
              <p>Total comment: {channel.comment}</p>
            </div>
          </div>

          <button
            className="hover:bg-blue-600 focus:ring-blue-400 ml-28 mt-10 w-4/5 rounded-lg bg-[#C94242] px-6 py-3 font-semibold text-white"
            onClick={handleButtonClick1}
          >
            SEE THE ANALYSIS
          </button>
          <button
            className="hover:bg-blue-600 focus:ring-blue-400 ml-28 mt-10 w-4/5 rounded-lg bg-[#C94242] px-6 py-3 font-semibold text-white"
            onClick={handleButtonClick2}
          >
            Export Data
          </button>
        </div>
        <VideoTable table_data={channel.videos} />
      </div>
    </div>
  );
};

export default ChannelAnalyze;
