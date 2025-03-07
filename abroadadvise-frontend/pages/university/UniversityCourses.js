import Link from "next/link";

const UniversityCourses = ({ courses }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-7xl mx-auto mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Courses Offered by {courses[0]?.university?.name}</h2>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.slug} className="bg-gray-100 p-4 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                {/* Course Icon */}
                {course.icon && (
                  <img src={course.icon} alt={course.name} className="h-12 w-12 object-cover rounded-full" />
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-500">Level: {course.level || "Not specified"}</p>
                  <p className="text-sm text-gray-500">Duration: {course.duration || "Not specified"}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{course.short_description || "No description available."}</p>

              {/* Fee */}
              {course.fee && (
                <p className="mt-2 text-sm font-medium text-gray-900">Fee: {course.fee}</p>
              )}

              <div className="mt-4">
                <Link href={`/course/${course.slug}`} passHref>
                  <a className="text-sm text-blue-600 hover:underline">View Course Details</a>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No courses available.</p>
        )}
      </div>
    </div>
  );
};

export default UniversityCourses;
