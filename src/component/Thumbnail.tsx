interface ThumbnailProps {
  link: string;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ link }) => {
  return <img src={link} alt="Thumbnail" />;
};

export default Thumbnail;
