"use client";

const CourseDiscipline = ({ disciplines }) => {
  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Disciplines</h2>

      <div className="flex flex-col gap-3">
        {Array.isArray(disciplines) && disciplines.length > 0 ? (
          disciplines.map((discipline) => (
            <div
              key={discipline.id}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-md text-gray-700 font-medium text-sm sm:text-base bg-gray-50 hover:bg-[#e6f3fc] hover:border-[#4c9bd5] transition-all"
            >
              {discipline.name}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No disciplines available</p>
        )}
      </div>
    </div>
  );
};

export default CourseDiscipline;
