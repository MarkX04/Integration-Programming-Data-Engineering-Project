import { useState, useEffect } from 'react';
// import mockCommentData from '../assets/mock_comment_data';
import CommentTable from '../component/CommentTable';
import { useParams } from 'react-router-dom';
import axios from 'axios';
interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  like: number;
  sentiment_score: number;
  avg_sentiment_score: number;
  wordcloud: string;
  video_id: string;
  video_title: string;
}

// function CommenttAnalyze() {
// const [comments, setcomments] = useState<Comments|null>(null)

//mock
const CommenttAnalyze: React.FC = () => {
  const { videoID } = useParams();
  const [comments, setcomments] = useState<Comment[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/comment_details/${videoID}`); //edit this
        console.log(response.data);
        setcomments(response.data);
      } catch (error) {
        console.error('Error fetching comments details:', error);
      }
    };
    fetchData();
  }, [videoID]);
  if (!comments) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-black">
        No comments available
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex-col overflow-auto bg-background p-2">
      <p className="ml-8 mt-20 text-xl font-bold">
        {comments.length > 0
          ? `Comment Information of video "${comments[0].video_title}"`
          : 'No video information available'}
      </p>

      <div className="item-center relative mt-10 flex flex-row justify-center space-x-40">
        <div className="flex-col space-y-4">
          <img className="h-44 w-96" src={`data:image/png;base64,${comments[0].wordcloud}`} alt="Wordcloud" />
          <div className="text-center text-xl font-bold text-black">Word Cloud of the commnent</div>
        </div>

        <div
          className={`flex h-40 w-40 flex-col items-center justify-center ${
            comments.length > 0
              ? comments.reduce((acc, comment) => acc + comment.sentiment_score, 0) / comments.length > 0
                ? 'bg-green-500'
                : comments.reduce((acc, comment) => acc + comment.sentiment_score, 0) / comments.length < 0
                  ? 'bg-red-500'
                  : 'bg-yellow-500'
              : 'bg-gray-500'
          }`}
        >
          {/* Display viewer reaction based on sentiment score */}
          <div className="text-center text-xl font-bold text-black">
            {comments.length > 0
              ? comments.reduce((acc, comment) => acc + comment.sentiment_score, 0) / comments.length > 0
                ? 'Positive viewer reaction'
                : comments.reduce((acc, comment) => acc + comment.sentiment_score, 0) / comments.length < 0
                  ? 'Negative viewer reaction'
                  : 'Neutral viewer reaction'
              : 'No comments available'}
          </div>
        </div>
      </div>
      <div className="item-center relative mt-10 flex justify-center">
        <CommentTable comments={comments} />
      </div>
    </div>
  );
};

export default CommenttAnalyze;
