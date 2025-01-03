// src/components/TopicBox.tsx
import { Link } from 'react-router-dom';

interface TopicBoxProps {
  id: number;
  title: string;
}

const TopicBox: React.FC<TopicBoxProps> = ({ id, title }) => {
  return (
    <Link
      to={`/topic/${id}`}
      className="flex h-40 w-64 items-center justify-center rounded-lg bg-white p-6 text-black transition duration-300 hover:w-full hover:bg-blue hover:text-white"
    >
      <div className="text-center text-3xl font-semibold">{title}</div>
    </Link>
  );
};

export default TopicBox;
