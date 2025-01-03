import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './component/NavBar';
import AboutUs from './pages/AboutUs';
import Homepage from './pages/Homepage';
import ContactUs from './pages/ContactUs';
import Dashboard from './pages/Dashboard';
import VideoAnalyze from './pages/VideoAnalyze';
import ChannelAnalyze from './pages/ChannelAnalyze';
import ChannelGraph from './pages/ChannelGraph';
import CommentAnalyze from './pages/CommentAnalyze';
import ChannelCompare from './pages/ChannelCompare';
import ExportDataChannel from './pages/ExportDataChannel';
import ExportDataVideo from './pages/ExportDataVideo';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Homepage />} /> {/* Trang chủ */}
        <Route path="/AboutUs" element={<AboutUs />} /> {/* Trang About Us */}
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/topic/1" element={<Dashboard topic="Education" />} />
        <Route path="/topic/2" element={<Dashboard topic="Trending" />} />
        <Route path="/topic/3" element={<Dashboard topic="Entertainment" />} />
        <Route path="/topic/4" element={<Dashboard topic="Food" />} />
        <Route path="/topic/5" element={<Dashboard topic="Fitness" />} />
        <Route path="/topic/6" element={<Dashboard topic="Others" />} />
        <Route path="/video-analyze/:videoId" element={<VideoAnalyze />} />
        <Route path="/channel-analyze/:channelID" element={<ChannelAnalyze />} />
        <Route path="/graph/:channelID" element={<ChannelGraph />} />
        <Route path="/comment-analyze/:videoID" element={<CommentAnalyze />} />
        <Route path="/Channel_Comparasion" element={<ChannelCompare />} />
        <Route path="/export/:channelID" element={<ExportDataChannel />} />
        <Route path="/export1/:videoID" element={<ExportDataVideo />} />
      </Routes>
    </Router>
  );
};

export default App;
