// src/components/NavBar.js
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="fixed top-0 z-30 h-16 w-full bg-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-black">
          <Link to="/">TubeTracker</Link>
        </div>

        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="rounded-lg px-6 py-2 text-black hover:bg-blue hover:text-white">
              Home
            </Link>
          </li>
          <li>
            <Link to="/Channel_Comparasion" className="rounded-lg px-6 py-2 text-black hover:bg-blue hover:text-white">
              Channel Comparision
            </Link>
          </li>
          <li>
            <Link to="/AboutUs" className="rounded-lg px-6 py-2 text-black hover:bg-blue hover:text-white">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/ContactUs" className="rounded-lg px-6 py-2 text-black hover:bg-blue hover:text-white">
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
