import { useEffect , useState} from "react";
import { CiSearch } from "react-icons/ci";
import { useFilter } from "@/context/filterContext";

const Searchbar = () => {

  const { searchQuery, setSearchQuery } = useFilter();
  const [searchInput , setSearchInput] = useState(searchQuery || "");

  const handleSearch = (e)=>{
  const value = e.target.value;
   
  setSearchInput(value);
  setSearchQuery(value);
  console.log(e.target.value);
  }
  return (
    <div className="w-[300px]">
      <div className="border border-gray-300 bg-white rounded-full px-4 py-2 flex items-center shadow-sm">
        <CiSearch className="text-gray-500 text-xl mr-2" />
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange= {handleSearch}
          className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>
    </div>
  );
};

export default Searchbar;
