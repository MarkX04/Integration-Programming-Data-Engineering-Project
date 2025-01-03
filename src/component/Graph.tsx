import { useState, useEffect } from 'react';

interface GraphComponentProps {
  title: string;
  imageUrl: string;
}

const GraphComponent: React.FC<GraphComponentProps> = ({ title, imageUrl }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const blob = await response.blob();
        const imageObjectURL = URL.createObjectURL(blob);
        setImage(imageObjectURL);
      } catch (err) {
        // Catch the error and type it
        setError(`Error fetching graph image: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    // Cleanup the object URL when the component unmounts
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [imageUrl, image]);

  return (
    <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="flex w-full items-center justify-center">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          image && <img src={image} alt="Graph" className="h-auto max-w-full rounded-md border" />
        )}
      </div>
    </div>
  );
};

export default GraphComponent;
