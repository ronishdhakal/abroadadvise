const DestinationAbout = ({ formData, onChange }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Destination Details</h2>

      {/* Why Choose This Destination */}
      <div className="mb-4">
        <label className="block text-gray-700">Why Choose This Destination?</label>
        <textarea
          name="why_choose"
          value={formData.why_choose}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      {/* Requirements */}
      <div className="mb-4">
        <label className="block text-gray-700">Requirements</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      {/* Required Documents */}
      <div className="mb-4">
        <label className="block text-gray-700">Required Documents</label>
        <textarea
          name="documents_required"
          value={formData.documents_required}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      {/* Scholarships */}
      <div className="mb-4">
        <label className="block text-gray-700">Scholarships</label>
        <textarea
          name="scholarships"
          value={formData.scholarships}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      {/* More Information */}
      <div className="mb-4">
        <label className="block text-gray-700">More Information</label>
        <textarea
          name="more_information"
          value={formData.more_information}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>

      {/* FAQs */}
      <div className="mb-4">
        <label className="block text-gray-700">FAQs</label>
        <textarea
          name="faqs"
          value={formData.faqs}
          onChange={onChange}
          className="border rounded-lg p-2 w-full"
        />
      </div>
    </div>
  );
};

export default DestinationAbout;
