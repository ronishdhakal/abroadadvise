"use client"

const CourseEligibility = ({ eligibility }) => {
  return (
    <div className="w-full bg-white shadow-lg rounded-xl p-6 border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Eligibility Requirements</h2>
      {eligibility ? (
        <div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: eligibility }} />
      ) : (
        <p className="text-gray-500">Eligibility details not available</p>
      )}
    </div>
  )
}

export default CourseEligibility
