const BlogBody = ({ blog }) => {
    if (!blog) return null;
  
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 mt-6">
        {/* Blog Content */}
        <div className="prose prose-lg prose-blue max-w-none text-gray-800">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>
    );
  };
  
  export default BlogBody;
  