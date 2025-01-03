import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';

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

// const ChannelGraph: React.FC = () => {
//   const { channelID } = useParams();
//   const [channel, setChannel] = useState<ChannelData | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://127.0.0.1:5000/api/channel_details/${channelID}`);
//         setChannel(response.data);
//       } catch (error) {
//         console.error('Error fetching channel details:', error);
//       }
//     };
//     fetchData();
//   }, [channelID]);

//   if (!channel) {
//     return <div className="flex h-screen w-full items-center justify-center bg-background text-black">Loading...</div>;
//   }

//   const videos = channel.videos.sort((a, b) => new Date(a.Date_modified).getTime() - new Date(b.Date_modified).getTime());

//   return (
//     <div className="mt-10 flex min-h-screen w-full flex-col items-center space-y-10 overflow-auto bg-background p-6">
//       <h1 className="text-2xl">Channel Video Metrics over Time</h1>

//       {/* Graph for Views */}
//       <h2 className="text-xl font-bold">Views Over Time</h2>
//       <ResponsiveContainer width="80%" height={400}>
//         <LineChart data={videos}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis
//             dataKey="Date_modified"
//             label={{
//               value: 'Date Modified',
//               position: 'insideBottomRight',
//               offset: 0,
//               fontWeight: 'bold',
//               fill: 'black',
//             }}
//           />
//           <YAxis
//             label={{ value: 'Views', angle: -90, position: 'insideLeft', fill: 'black', fontWeight: 'bold' }} // Bold Y-axis label
//           />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="view"
//             stroke="#FF6347" // Tomato color for views
//             strokeWidth={3}
//             dot={{ r: 6 }}
//             activeDot={{ r: 8 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>

//       {/* Graph for Likes */}
//       <h2 className="text-xl font-bold">Likes Over Time</h2>
//       <ResponsiveContainer width="80%" height={400}>
//         <LineChart data={videos}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis
//             dataKey="Date_modified"
//             label={{
//               value: 'Date Modified',
//               position: 'insideBottomRight',
//               offset: 0,
//               fontWeight: 'bold',
//               fill: 'black',
//             }}
//           />
//           <YAxis label={{ value: 'Likes', angle: -90, position: 'insideLeft', fill: 'black', fontWeight: 'bold' }} />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="like"
//             stroke="#82ca9d" // Green color for likes
//             strokeWidth={3}
//             dot={{ r: 6 }}
//             activeDot={{ r: 8 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>

//       {/* Graph for Comments */}
//       <h2 className="text-xl font-bold">Comments Over Time</h2>
//       <ResponsiveContainer width="80%" height={400}>
//         <LineChart data={videos}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis
//             dataKey="Date_modified"
//             label={{
//               value: 'Date Modified',
//               position: 'insideBottomRight',
//               offset: 0,
//               fontWeight: 'bold',
//               fill: 'black',
//             }}
//           />
//           <YAxis label={{ value: 'Comments', angle: -90, position: 'insideLeft', fill: 'black', fontWeight: 'bold' }} />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="comment"
//             stroke="#8884d8" // Purple color for comments
//             strokeWidth={3}
//             dot={{ r: 6 }}
//             activeDot={{ r: 8 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ChannelGraph;
const ChannelGraph: React.FC = () => {
  const { channelID } = useParams();
  const [channel, setChannel] = useState<ChannelData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('view');

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

  const videos = channel.videos.sort(
    (a, b) => new Date(a.Date_modified).getTime() - new Date(b.Date_modified).getTime(),
  );

  const renderLineChart = (dataKey: string, strokeColor: string, yAxisLabel: string) => (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={videos}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="Date_modified"
          label={{
            value: 'Date Modified',
            position: 'insideBottomRight',
            offset: -5,
            fontWeight: 'bold',
            fill: 'black',
          }}
          // Custom tick formatter to show the date in "day-month-year" format
          tickFormatter={(tick) => {
            const date = new Date(tick);
            return date.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
          }}
        />
        <YAxis
          label={{
            value: yAxisLabel,
            angle: -90,
            position: 'insideLeft',
            fill: 'black',
            fontWeight: 'bold',
          }}
        />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={strokeColor}
          strokeWidth={3}
          dot={{ r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const exportGraphAsImage = async () => {
    const graphElement = document.querySelector('.recharts-wrapper');
    if (graphElement) {
      const canvas = await html2canvas(graphElement as HTMLElement);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'graph.png';
      link.click();
    }
  };

  return (
    <div className="relative mt-10 flex min-h-screen w-full flex-row items-center justify-center space-y-2 overflow-auto bg-background py-10">
      <div className="container mx-auto flex flex-col items-center rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-2xl">Channel Video Metrics over Time</h1>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setSelectedMetric('view')}
            className={`rounded px-4 py-2 ${selectedMetric === 'view' ? 'bg-blue text-white' : 'text-black'} hover:bg-blue`}
          >
            Views
          </button>
          <button
            onClick={() => setSelectedMetric('like')}
            className={`rounded px-4 py-2 ${selectedMetric === 'like' ? 'bg-blue text-white' : 'text-black'} hover:bg-blue`}
          >
            Likes
          </button>
          <button
            onClick={() => setSelectedMetric('comment')}
            className={`rounded px-4 py-2 ${selectedMetric === 'comment' ? 'bg-blue text-white' : 'text-black'} hover:bg-blue`}
          >
            Comments
          </button>
        </div>
        {selectedMetric === 'view' && renderLineChart('view', '#FF6347', 'Views')}
        {selectedMetric === 'like' && renderLineChart('like', '#82ca9d', 'Likes')}
        {selectedMetric === 'comment' && renderLineChart('comment', '#8884d8', 'Comments')}
        <button
          onClick={exportGraphAsImage}
          className="mt-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
        >
          Export as Image
        </button>
      </div>
    </div>
  );
};

export default ChannelGraph;
