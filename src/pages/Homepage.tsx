import { useRef } from 'react';
import TopicButton from '../component/TopicButton';
import icon from '../assets/icon.svg';

function Homepage() {
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const scrollToCategory = () => {
    if (categoryRef.current) {
      categoryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const topics = [
    { id: 1, title: 'Education' },
    { id: 2, title: 'Trending' },
    { id: 3, title: 'Entertainment' },
    { id: 4, title: 'Food' },
    { id: 5, title: 'Fitness' },
    { id: 6, title: 'Other' },
  ];
  return (
    <div className="relative">
      {/* Landing Page Section */}
      <div className="relative flex h-screen items-center justify-between bg-[#ededed] px-16">
        <div className="absolute left-[-456px] top-[-384px] h-[1168px] w-[1177px] scale-50 rounded-full bg-[#fcab97] blur-[200px]" />
        <div className="absolute bottom-[-384px] right-[-456px] h-[1168px] w-[1177px] scale-50 rounded-full bg-[#fcab97] blur-[200px]" />

        <div className="z-10 flex w-1/2 flex-col items-start justify-center">
          <div className="z-15 mb-20 mt-20 text-[58px] font-bold text-black">Make your analysis fast and easy</div>
          <div className="font-['DM Sans'] z-10 mb-10 text-left text-3xl font-medium leading-[42px] text-[#151438] opacity-70">
            We give you complete freedom over your analysis process - get & visualize your data. Our project is built to
            support YouTube user's association analysis.
          </div>

          <div className="z-10 mb-16 mt-16">
            <button
              onClick={scrollToCategory}
              className="h-[78.51px] w-[392.55px] rounded-[100px] bg-[#2700fe] text-center text-3xl font-medium text-white"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Icon Youtube */}
        <div className="z-10 flex w-1/2 items-center justify-center">
          <img src={icon} alt="Background Shape" className="h-auto w-[80%] object-contain" />
        </div>
      </div>

      {/* Category Section */}
      <div ref={categoryRef} className="relative flex h-screen flex-col items-center justify-center bg-[#ededed] px-16">
        <div className="absolute left-[-456px] top-[-384px] h-[1168px] w-[1177px] scale-50 rounded-full bg-[#fcab97] blur-[200px]" />
        <div className="absolute bottom-[-384px] right-[-456px] h-[1168px] w-[1177px] scale-50 rounded-full bg-[#fcab97] blur-[200px]" />

        <div className="z-10 mb-10 text-[58px] font-bold text-black">Choose your category</div>
        <div className="z-10 grid grid-cols-3 gap-6">
          {' '}
          {/* Grid để tạo 3 cột */}
          {topics.map((topic) => (
            <TopicButton key={topic.id} id={topic.id} title={topic.title} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
