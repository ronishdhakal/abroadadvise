const NewsBody = ({ news }) => {
  if (!news) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
      {/* News Content */}
      <div
        className="prose prose-lg prose-blue max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: news.detail }}
      />
    </div>
  );
};

export default NewsBody;
