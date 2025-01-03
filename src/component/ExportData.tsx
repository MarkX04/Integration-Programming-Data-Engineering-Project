import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { saveAs } from 'file-saver';

interface ExportDataProps {
  exportType: string;
}

const ExportData: React.FC<ExportDataProps> = ({ exportType }) => {
  const { channelID, videoID } = useParams();
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const attributesByType: Record<string, string[]> = {
    channel: ['id', 'title', 'description', 'subscriber', 'view', 'video', 'like', 'comment', 'video_list'],
    video: [
      'id',
      'title',
      'description',
      'tags',
      'view',
      'like',
      'comment',
      'date_modified',
      'duration',
      'category',
      'like_view_ratio',
      'comment_view_ratio',
      'video_url',
      'comment_list',
    ],
  };

  // Fetch data function
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/export_data', {
        type: exportType,
        channelID: exportType === 'channel' ? channelID : undefined,
        videoID: exportType === 'video' ? videoID : undefined,
        attributes: selectedAttributes,
      });
      setData(response.data);
    } catch {
      setError('An error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  }, [exportType, channelID, videoID, selectedAttributes]);

  useEffect(() => {
    if (selectedAttributes.length > 0) {
      fetchData();
    }
  }, [selectedAttributes, fetchData]);

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedAttributes((prevState) =>
      prevState.includes(value) ? prevState.filter((attr) => attr !== value) : [...prevState, value],
    );
  };

  const handleExport = () => {
    if (data) {
      const csvData = [
        Object.keys(data).join(','), // Header
        Object.values(data).join(','), // Data
      ].join('\n');

      const blob = new Blob([csvData], { type: 'text/csv' });
      saveAs(blob, `${exportType}_export.csv`);
    }
  };

  return (
    <div className="relative mt-10 flex min-h-screen w-full flex-row items-center justify-center space-y-2 overflow-auto bg-background py-10">
      <div className="container mx-auto rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Export {exportType} Data</h1>

        <div className="mb-6 rounded-lg bg-red-100 p-4">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Select Attributes to Export</h2>
          <div className="grid grid-cols-2 gap-4">
            {attributesByType[exportType].map((attribute) => (
              <label key={attribute} className="flex items-center">
                <input type="checkbox" value={attribute} onChange={handleAttributeChange} className="mr-2" />
                <span className="text-gray-600">{attribute}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleExport}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white transition duration-300 hover:bg-red-700"
          disabled={isLoading || selectedAttributes.length === 0}
        >
          {isLoading ? 'Exporting...' : 'Export as CSV'}
        </button>

        {error && <div className="mt-4 text-center text-red-500">{error}</div>}

        {data && (
          <div className="mt-6 overflow-x-auto rounded-lg bg-gray-100 p-4">
            <h2 className="mb-4 text-xl font-semibold text-gray-700">Fetched Data</h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {selectedAttributes.map((key) => (
                    <th
                      key={key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  {selectedAttributes.map((key, index) => (
                    <td key={index} className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {data[key]}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportData;
