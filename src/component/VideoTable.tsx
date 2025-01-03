import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface VideoTableProps {
  table_data: {
    id: string;
    name: string;
    Date_modified: string;
    duration: string;
    view: number;
    like: number;
    comment: number;
  }[];
}

const VideoTable: React.FC<VideoTableProps> = ({ table_data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: 'name' | 'Date_modified' | 'duration' | 'view' | 'like' | 'comment';
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 10;
  const convertToSeconds = (duration: string): number => {
    const timeParts = duration.split(':'); // Tách ra phần giờ, phút, giây
    let hours = 0,
      minutes = 0,
      seconds = 0;

    if (timeParts.length === 3) {
      hours = parseInt(timeParts[0], 10);
      minutes = parseInt(timeParts[1], 10);
      seconds = parseInt(timeParts[2], 10);
    } else if (timeParts.length === 2) {
      minutes = parseInt(timeParts[0], 10);
      seconds = parseInt(timeParts[1], 10);
    } else if (timeParts.length === 1) {
      seconds = parseInt(timeParts[0], 10);
    }

    // Chuyển đổi toàn bộ thời gian thành số giây
    return hours * 3600 + minutes * 60 + seconds;
  };
  const sortedData = [...table_data].sort((a, b) => {
    if (sortConfig !== null) {
      if (sortConfig.key === 'duration') {
        // Chuyển đổi Duration thành giây trước khi so sánh
        const durationA = convertToSeconds(a[sortConfig.key]);
        const durationB = convertToSeconds(b[sortConfig.key]);

        if (durationA < durationB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (durationA > durationB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    }
    return 0;
  });

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = sortedData.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(table_data.length / videosPerPage);

  // Hàm để chuyển trang
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key: 'name' | 'Date_modified' | 'duration' | 'view' | 'like' | 'comment') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionArrow = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };
  const data = Array.isArray(table_data) ? table_data : [];
  if (data.length === 0) {
    return <div>No videos available</div>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <table className="w-full table-auto border-collapse rounded-lg bg-white shadow-md">
        <thead className="bg-[#C94242] text-white">
          <tr>
            <th className="cursor-pointer border-b px-4 py-2 text-left" onClick={() => handleSort('name')}>
              Video Title {getSortDirectionArrow('name')}
            </th>
            <th className="cursor-pointer border-b px-4 py-2 text-left" onClick={() => handleSort('Date_modified')}>
              Date Modified {getSortDirectionArrow('Date_modified')}
            </th>
            <th className="cursor-pointer border-b px-4 py-2 text-left" onClick={() => handleSort('duration')}>
              Duration {getSortDirectionArrow('duration')}
            </th>
            <th className="cursor-pointer border-b px-4 py-2 text-left" onClick={() => handleSort('view')}>
              View {getSortDirectionArrow('view')}
            </th>
            <th className="cursor-pointer border-b px-4 py-2 text-left" onClick={() => handleSort('like')}>
              Like {getSortDirectionArrow('like')}
            </th>
            <th className="cursor-pointer border-b px-4 py-2 text-left" onClick={() => handleSort('comment')}>
              Comment {getSortDirectionArrow('comment')}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentVideos.map((item, index) => (
            <tr key={index} className="bg-[#CAC4D0]">
              <td className="max-w-[150px] overflow-hidden truncate whitespace-nowrap border-b px-4 py-2">
                <Link to={`/video-analyze/${item.id}`} className="text-blue-500 hover:underline">
                  {item.name}
                </Link>
              </td>
              <td className="border-b px-4 py-2">{item.Date_modified}</td>
              <td className="border-b px-4 py-2">{item.duration}</td>
              <td className="border-b px-4 py-2">{item.view}</td>
              <td className="border-b px-4 py-2">{item.like}</td>
              <td className="border-b px-4 py-2">{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          {/* Button for first page */}
          {currentPage > 1 && (
            <button onClick={() => handlePageChange(1)} className="mx-1 border bg-white px-3 py-1 text-black">
              &lt;&lt;
            </button>
          )}

          {/* Left arrow for previous page */}
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="mx-1 border bg-white px-3 py-1 text-black"
            >
              &lt;
            </button>
          )}

          {/* Button for previous pages */}
          {currentPage > 2 && <span className="mx-1 border px-3 py-1">...</span>}

          {/* Display pages around current page */}
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter((page) => page >= currentPage - 2 && page <= currentPage + 2)
            .map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`mx-1 border px-3 py-1 ${
                  currentPage === page ? 'bg-[#C94242] text-white' : 'bg-white text-black'
                }`}
              >
                {page}
              </button>
            ))}

          {/* Button for next pages */}
          {currentPage < totalPages - 1 && <span className="mx-1 border px-3 py-1">...</span>}

          {/* Right arrow for next page */}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="mx-1 border bg-white px-3 py-1 text-black"
            >
              &gt;
            </button>
          )}

          {/* Button for last page */}
          {currentPage < totalPages && (
            <button onClick={() => handlePageChange(totalPages)} className="mx-1 border bg-white px-3 py-1 text-black">
              &gt;&gt;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoTable;
