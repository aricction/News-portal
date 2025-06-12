import { useState , useRef, useEffect} from "react";
import { RiHome5Line } from "react-icons/ri";
import { FiPieChart } from "react-icons/fi";
import { PiSpeedometerFill } from "react-icons/pi";
import { RiDashboardFill } from "react-icons/ri";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

const SideBar = ({ isDark }) => {
  const [collapsed, setCollapsed] = useState(true);
  const dropdownRef = useRef();


useEffect(() => {
  const handleClickOutside = (e) => {
    if (
      !collapsed && // only when sidebar is open
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      setCollapsed(true);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [collapsed]); 



  return (
    <div   ref={dropdownRef}
      className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300  hidden lg:block ${
        collapsed ? "w-16" : "w-60"
      } ${isDark ? "bg-gray-900" : "bg-white"} shadow-md`}
       
    >
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <IoIosArrowForward className="text-xl" />
          ) : (
            <IoIosArrowBack className="text-xl" />
          )}
        </button>
      </div>

      <div className="flex flex-col items-start gap-8 px-4 mt-6">
        <div className="flex items-center gap-4">
          <RiDashboardFill size={20} className="text-purple-700" />
          {!collapsed && <span className="text-sm font-semibold">Dashboard</span>}
        </div>

        <Link href="/dashboard">
          <div className="flex items-center gap-4 cursor-pointer hover:text-purple-600">
            <RiHome5Line
              size={20}
              className={`${isDark ? "text-white" : "text-gray-500"}`}
            />
            {!collapsed && <span className="text-sm">Home</span>}
          </div>
        </Link>

        <Link href="/analytics">
          <div className="flex items-center gap-4 cursor-pointer hover:text-purple-600">
            <FiPieChart
              size={20}
              className={`${isDark ? "text-white" : "text-gray-500"}`}
            />
            {!collapsed && <span className="text-sm">Analytics</span>}
          </div>
        </Link>

        
      </div>
    </div>
  );
};

export default SideBar;
