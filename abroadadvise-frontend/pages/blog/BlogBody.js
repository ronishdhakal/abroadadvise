const BlogBody = ({ blog }) => {
  if (!blog) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
      <div
        className="prose prose-lg prose-blue max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
};

export default BlogBody;
