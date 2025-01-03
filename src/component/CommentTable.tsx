import React from 'react';

// The CommentTable component now accepts comments as a prop
interface CommentTableProps {
  comments: {
    id: string;
    author: string;
    text: string;
    date: string;
    like: number;
    sentiment_score: number;
  }[];
}

const CommentTable: React.FC<CommentTableProps> = ({ comments }) => {
  return (
    <div className="max-w-5xl">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border bg-[#C94242] px-4 py-2 text-white">Index</th>
            <th className="border bg-[#C94242] px-4 py-2 text-white">Author</th>
            <th className="border bg-[#C94242] px-4 py-2 text-white">Content</th>
            <th className="border bg-[#C94242] px-4 py-2 text-white">Date</th>
            <th className="border bg-[#C94242] px-4 py-2 text-white">Like Count</th>
            <th className="border bg-[#C94242] px-4 py-2 text-white">Sentiment Score</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={comment.id} className="border-t">
              <td className="border bg-white px-4 py-2 text-black">{index + 1}</td>
              <td className="border bg-white px-4 py-2 text-black">{comment.author}</td>
              <td className="border bg-white px-4 py-2 text-black">{comment.text}</td>
              <td className="border bg-white px-4 py-2 text-black">{new Date(comment.date).toLocaleString()}</td>
              <td className="border bg-white px-4 py-2 text-black">{comment.like}</td>
              <td className="border bg-white px-4 py-2 text-black">{comment.sentiment_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommentTable;
