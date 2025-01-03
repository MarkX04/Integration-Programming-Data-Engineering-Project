import { useState, useEffect } from 'react';
import axios from 'axios';

interface Channel {
  id: string;
  title: string;
  subscriber: number;
  video: number;
  view: number;
  like: number;
  comment: number;
}

function ChannelCompare() {
  const [channel1, setChannel1] = useState<string>('');
  const [channel2, setChannel2] = useState<string>('');
  const [channelData1, setChannelData1] = useState<Channel | null>(null);
  const [channelData2, setChannelData2] = useState<Channel | null>(null);
  const [error, setError] = useState<string>('');
  const [subscriberDif, setSubscriberDif] = useState<number>(0);
  const [videoDif, setVideoDif] = useState<number>(0);
  const [viewDif, setViewDif] = useState<number>(0);
  const [likeDif, setLikeDif] = useState<number>(0);
  const [commentDif, setCommentDif] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [engagementCoefficient1, setEngagementCoefficient1] = useState<number>(0);
  const [engagementCoefficient2, setEngagementCoefficient2] = useState<number>(0);

  const fetchChannelData = async () => {
    if (!channel1 || !channel2) {
      setError('Please enter both channel names.');
      return;
    }
    setError('');
    try {
      const response1 = await axios.post(`http://127.0.0.1:5000/api/compare_channel`, { channel_title: channel1 });
      const response2 = await axios.post(`http://127.0.0.1:5000/api/compare_channel`, { channel_title: channel2 });

      if (response1.data.length > 0) {
        setChannelData1(response1.data[0]);
      } else {
        setError(`Channel ${channel1} not found.`);
      }
      if (response2.data.length > 0) {
        setChannelData2(response2.data[0]);
      } else {
        setError(`Channel ${channel2} not found.`);
      }
    } catch (error) {
      console.error('Error fetching channel data:', error);
      setError('Failed to fetch channel data.');
    }
  };

  useEffect(() => {
    if (channelData1 && channelData2) {
      // calculate channel 1 engagement score
      setEngagementCoefficient1(
        ((channelData1.view * 1 + channelData1.like * 2 + channelData1.comment * 5 + channelData1.subscriber) /
          channelData1.view) *
          10,
      );
      setEngagementCoefficient2(
        ((channelData2.view * 1 + channelData2.like * 2 + channelData2.comment * 5 + channelData2.subscriber) /
          channelData2.view) *
          10,
      );

      // Calculate the percentage differences between each attribute
      setSubscriberDif(
        Math.round(((channelData1.subscriber - channelData2.subscriber) / channelData2.subscriber) * 10000) / 100,
      );
      setVideoDif(Math.round(((channelData1.video - channelData2.video) / channelData2.video) * 10000) / 100);
      setViewDif(Math.round(((channelData1.view - channelData2.view) / channelData2.view) * 10000) / 100);
      setLikeDif(Math.round(((channelData1.like - channelData2.like) / channelData2.like) * 10000) / 100);
      setCommentDif(Math.round(((channelData1.comment - channelData2.comment) / channelData2.comment) * 10000) / 100);

      // apply engagement score and percentage  to the overall score
      setScore(
        ((Math.round(subscriberDif / 10) +
          Math.round(videoDif / 10) +
          Math.round(viewDif / 10) +
          Math.round(likeDif / 10) +
          Math.round(commentDif / 10)) *
          engagementCoefficient1) /
          engagementCoefficient2,
      );
    }
  }, [channelData1, channelData2, subscriberDif, videoDif, viewDif, likeDif, commentDif]);

  return (
    <div className="mt-10 flex min-h-screen w-full flex-col items-center space-y-10 overflow-auto bg-background p-6">
      <h1 className="relative mt-10 w-full rounded-lg bg-[#9B363F] p-4 text-center text-2xl font-bold text-white">
        Channel Comparison Model
      </h1>

      <div className="flex w-full max-w-4xl flex-row justify-center space-x-10">
        <input
          type="text"
          placeholder="Input the First Channel"
          className="w-full rounded-lg border border-gray-400 p-3 sm:w-auto"
          onChange={(e) => setChannel1(e.target.value)}
          value={channel1}
        />
        <input
          type="text"
          placeholder="Input the Second Channel"
          className="w-full rounded-lg border border-gray-400 p-3 sm:w-auto"
          onChange={(e) => setChannel2(e.target.value)}
          value={channel2}
        />
        <button
          onClick={fetchChannelData}
          className="hover:bg-blue-600 rounded-lg bg-[#9B363F] p-3 font-bold text-white transition"
        >
          Compare
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {channelData1 && channelData2 && (
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="min-w-full rounded-lg border border-black bg-white shadow-lg">
            <thead>
              <tr>
                <th className="border border-black bg-[#9B363F] p-4 text-left text-white">Category</th>
                <th className="border border-black bg-[#9B363F] p-4 text-left text-white">
                  <a href={`/channel-analyze/${channelData1.id}`} className="text-white hover:underline">
                    {channelData1.title}
                  </a>
                </th>
                <th className="border border-black bg-[#9B363F] p-4 text-left text-white">
                  <a href={`/channel-analyze/${channelData2.id}`} className="text-white hover:underline">
                    {channelData2.title}
                  </a>
                </th>
                <th className="border border-black bg-[#9B363F] p-4 text-left text-white">Difference</th>
                <th className="border border-black bg-[#9B363F] p-4 text-left text-white">Percentage Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-4">Subscriber</td>
                <td className="border border-black p-4">{channelData1.subscriber}</td>
                <td className="border border-black p-4">{channelData2.subscriber}</td>
                <td
                  className={`border border-black p-4 ${
                    channelData1.subscriber - channelData2.subscriber >= 0 ? 'bg-green-200' : 'bg-red-200'
                  }`}
                >
                  {channelData1.subscriber - channelData2.subscriber >= 0 ? (
                    <>+{Math.round((channelData1.subscriber - channelData2.subscriber) * 10) / 10} ▲</>
                  ) : (
                    <>{Math.round((channelData1.subscriber - channelData2.subscriber) * 10) / 10} ▼</>
                  )}
                </td>

                <td className={`border border-black p-4 ${subscriberDif >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {subscriberDif >= 0 ? <>+{subscriberDif}% ▲</> : <>{subscriberDif}% ▼</>}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-4">Total Videos</td>
                <td className="border border-black p-4">{channelData1.video}</td>
                <td className="border border-black p-4">{channelData2.video}</td>
                <td
                  className={`border border-black p-4 ${
                    channelData1.video - channelData2.video >= 0 ? 'bg-green-200' : 'bg-red-200'
                  }`}
                >
                  {channelData1.video - channelData2.video >= 0 ? (
                    <>+{Math.round((channelData1.video - channelData2.video) * 10) / 10} ▲</>
                  ) : (
                    <>{Math.round((channelData1.video - channelData2.video) * 10) / 10} ▼</>
                  )}
                </td>
                <td className={`border border-black p-4 ${videoDif >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {videoDif >= 0 ? <>+{videoDif}% ▲</> : <>{videoDif}% ▼</>}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-4">Average Views</td>
                <td className="border border-black p-4">{channelData1.view}</td>
                <td className="border border-black p-4">{channelData2.view}</td>
                <td
                  className={`border border-black p-4 ${channelData1.view - channelData2.view >= 0 ? 'bg-green-200' : 'bg-red-200'}`}
                >
                  {channelData1.view - channelData2.view >= 0 ? (
                    <>+{Math.round((channelData1.view - channelData2.view) * 10) / 10} ▲</>
                  ) : (
                    <>{Math.round((channelData1.view - channelData2.view) * 10) / 10} ▼</>
                  )}
                </td>
                <td className={`border border-black p-4 ${viewDif >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {viewDif >= 0 ? <>+{viewDif}% ▲</> : <>{viewDif}% ▼</>}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-4">AverageLikes</td>
                <td className="border border-black p-4">{channelData1.like}</td>
                <td className="border border-black p-4">{channelData2.like}</td>
                <td
                  className={`border border-black p-4 ${channelData1.like - channelData2.like >= 0 ? 'bg-green-200' : 'bg-red-200'}`}
                >
                  {channelData1.like - channelData2.like >= 0 ? (
                    <>+{Math.round((channelData1.like - channelData2.like) * 10) / 10} ▲</>
                  ) : (
                    <>{Math.round((channelData1.like - channelData2.like) * 10) / 10} ▼</>
                  )}
                </td>

                <td className={`border border-black p-4 ${likeDif >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {likeDif >= 0 ? <>+{likeDif}% ▲</> : <>{likeDif}% ▼</>}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-4">Average Comments</td>
                <td className="border border-black p-4">{channelData1.comment}</td>
                <td className="border border-black p-4">{channelData2.comment}</td>
                <td
                  className={`border border-black p-4 ${
                    channelData1.comment - channelData2.comment >= 0 ? 'bg-green-200' : 'bg-red-200'
                  }`}
                >
                  {channelData1.comment - channelData2.comment >= 0 ? (
                    <>+{Math.round((channelData1.comment - channelData2.comment) * 10) / 10} ▲</>
                  ) : (
                    <>{Math.round((channelData1.comment - channelData2.comment) * 10) / 10} ▼</>
                  )}
                </td>
                <td className={`border border-black p-4 ${commentDif >= 0 ? 'bg-green-200' : 'bg-red-200'}`}>
                  {commentDif >= 0 ? <>+{commentDif}% ▲</> : <>{commentDif}% ▼</>}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Score Section */}
          <div className="mt-10 flex items-center justify-center">
            <div className="rounded-lg bg-gray-100 p-6 shadow-lg">
              {/* <h2 className="text-center text-xl font-bold">Score</h2> */}
              {/* <p className="mt-4 text-center text-2xl font-semibold text-[#9B363F]">{score}</p> */}
              <div className="font-['DM Sans'] text-3xl font-semibold leading-[50px] text-black">
                {score > 5 ? (
                  <p>
                    {channelData1?.title} perform drastically better than {channelData2?.title}
                  </p>
                ) : score < -5 ? (
                  <p>
                    {channelData1?.title} perform drastically less than {channelData2?.title}
                  </p>
                ) : score > 2 ? (
                  <p>
                    {channelData1?.title} perform signicantly better than {channelData2?.title}
                  </p>
                ) : score < -2 ? (
                  <p>
                    {channelData1?.title} perform signicantly less than {channelData2?.title}
                  </p>
                ) : (
                  <p>
                    {channelData1?.title} perform fairly similar to {channelData2?.title}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChannelCompare;
