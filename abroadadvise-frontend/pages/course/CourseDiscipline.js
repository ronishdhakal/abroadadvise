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
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-gray-800 font-medium text-sm sm:text-base transition hover:bg-gray-50 hover:border-gray-300"
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
