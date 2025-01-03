import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
interface VideoProps {
  id: string;
  title: string;
  description: string;
  tags: string;
  view: number;
  like: number;
  comment: number;
  date_modified: string;
  duration: string;
  category: string;
  like_view_ratio: number;
  comment_view_ratio: number;
  thumbnail: string;
  video_url: string;
  channel: Channel;
}

interface Channel {
  id: string;
  title: string;
  subscriber: number;
  view: number;
  video: number;
}

const VideoAnalyze: React.FC = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<VideoProps | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/video_details/${videoId}`);
        setVideo(response.data);
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };
    fetchData();
  }, [videoId]);
  if (!video) {
    return <div className="flex h-screen w-full items-center justify-center bg-background text-black">Loading...</div>;
  }
  //for truncate description

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // const VideoAnalyze: React.FC = () => {
  //   // Mock video data
  //   const mockVideo: VideoProps = {
  //     id: '1',
  //     title: 'Sơn Tùng M-TP | Đúng Làm Trái Tim Anh Đau | Official Music Video',
  //     description:
  //       "Official music video of Sơn Tùng M-TP's latest hit song!Official music video of Sơn Tùng M-TP's latest hit song!Official music video of Sơn Tùng M-TP's latest hit song!Official music video of Sơn Tùng M-TP's latest hit song!Official music video of Sơn Tùng M-TP's latest hit song!Official music video of Sơn Tùng M-TP's latest hit song!Official music video of Sơnddfdfd Tùng M-TP's latest hit song!Official music video of Sơn Tùng M-TP's latest hit song!",
  //     tags: 'Sơn Tùng, music, video, official',
  //     view: 3500000,
  //     like: 200000,
  //     comment: 5000,
  //     date_modified: '2024-12-01',
  //     duration: '5:26',
  //     category: 'Music',
  //     like_view_ratio: 0.057,
  //     comment_view_ratio: 0.0014,
  //     thumbnail: 'https://i.ytimg.com/vi/eF42RAborxI/maxresdefault.jpg',
  //     channel: {
  //       id: '1',
  //       title: 'Sơn Tùng M-TP Official',
  //       subscriber: 1200000,
  //       view: 150000000,
  //       video: 150,
  //     },
  //   };

  // const [video, setVideo] = useState<VideoProps | null>(mockVideo); // Use mock data as initial state
  // const [isExpanded, setIsExpanded] = useState(false);
  // if (!video) {
  //   return <div className="flex h-screen w-full items-center justify-center bg-background text-black">Loading...</div>;
  // }
  // const toggleExpanded = () => {
  //   setIsExpanded(!isExpanded);
  // };

  return (
    <div className="min-h-screen w-full flex-col overflow-auto bg-background p-2">
      <p className="ml-8 mt-20 text-3xl font-bold">Video Information</p>
      <div className="flex flex-row items-center justify-center space-y-2 overflow-auto bg-background">
        <div className="mt-2 flex-col space-y-8">
          <div className="flex h-[300px] w-[500px] flex-col items-center justify-center space-y-2 rounded-lg border bg-[#C94242] p-2">
            {/* Thumbnail */}
            <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="block w-full">
              <img src={video.thumbnail} alt="Video Thumbnail" className="h-[200px] w-full rounded-lg object-cover" />
            </a>
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white hover:underline"
            >
              {video.video_url}
            </a>
          </div>
          {/* Video Details */}
          <div className="w-full max-w-3xl space-y-1 rounded-lg border border-gray-300 bg-white p-4">
            <h6 className="text-xl font-bold">{video.title}</h6>
            <p className={`text-gray-600 ${isExpanded ? '' : 'truncate'}`}>{video.description}</p>
            <button onClick={toggleExpanded} className="text-blue-500 hover:underline">
              {isExpanded ? 'See less' : 'See more'}
            </button>

            <div className="flex flex-row">
              {' '}
              <div className="flex-col space-y-6">
                <span className="flex gap-2">
                  {' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  {video.view} views
                </span>
                <span className="flex gap-2">
                  {' '}
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
                      d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                    />
                  </svg>
                  {video.like} likes
                </span>
                <span className="flex gap-2">
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
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                  {video.comment} comments
                </span>
              </div>
              <div className="ml-28 flex flex-col space-y-2">
                <span>
                  <span className="font-bold">Duration: </span>
                  {video.duration}
                </span>
                <span>
                  <span className="font-bold">Date Modified: </span>
                  {video.date_modified}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="item-center flex-col justify-center space-y-20">
          {' '}
          <div className="border-blue-500 ml-28 flex h-auto w-64 flex-col rounded-lg border-2 bg-[#9B363F] p-6 text-white shadow-lg">
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
              <Link to={`/channel-analyze/${video.channel.id}`}>{video.channel.title}</Link>
            </h3>
            <div className="mt-6 flex flex-col space-y-2">
              <p>{video.channel.subscriber} subscribers</p>
              <p>{video.channel.video} videos</p>
              <p>{video.channel.view} views</p>
            </div>
          </div>
          <div className="ml-28 space-y-4">
            <a
              href={`/channel-analyze/${video.channel.id}`}
              className="block w-auto gap-4 rounded-lg bg-[#C94242] p-4 text-center text-white"
            >
              <h3 className="text-xl font-bold">Go to Channel Page</h3>
              <p> Discover the Channel Analyze of this Video</p>
            </a>

            <a
              href={`/comment-analyze/${video.id}/`}
              className="block w-auto gap-4 rounded-lg bg-[#C94242] p-4 text-center text-white"
            >
              <h3 className="text-xl font-bold">Go to Comments Page</h3>
              <p> Discover the Comment Analyze for the Video</p>
            </a>

            <a
              href={`/export1/${video.id}/`}
              className="block w-auto gap-4 rounded-lg bg-[#C94242] p-4 text-center text-white"
            >
              <h3 className="text-xl font-bold">Export Data</h3>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalyze;
