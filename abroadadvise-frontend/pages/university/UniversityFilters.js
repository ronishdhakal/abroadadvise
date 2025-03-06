const UniversityFilters = ({ searchQuery, setSearchQuery, selectedCountry, setSelectedCountry }) => {
    return (
        <div className="container mx-auto px-4 py-6 flex flex-wrap justify-between items-center">
            <input
                type="text"
                placeholder="Search for a university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-1/3 px-4 py-2 border rounded-lg shadow-sm"
            />
            <select 
                value={selectedCountry} 
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full sm:w-1/4 px-4 py-2 border rounded-lg shadow-sm mt-2 sm:mt-0"
            >
                <option value="">Filter by Country</option>
                {/* Dynamically populate options here */}
            </select>
        </div>
    );
};