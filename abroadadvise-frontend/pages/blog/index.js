import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import Header from "../../components/header";  // ✅ Ensure correct import casing
import Footer from "../../components/footer";  // ✅ Ensure correct import casing

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/`);
        const data = await res.json();
        setBlogs(data.results || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <>
      <Head>
        <title>Blog - Abroad Advise</title>
      </Head>

      <Header />

      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>

        {blogs.length === 0 ? (
          <p className="text-center">No blogs available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="border rounded-lg shadow-md p-4">
                <Link href={`/blog/${blog.slug}`} className="text-xl font-semibold hover:text-blue-500">
                  {blog.title}
                </Link>
                <p className="text-gray-500 text-sm">By {blog.author_name} • {new Date(blog.published_date).toLocaleDateString()}</p>
                {blog.featured_image && (
                  <img src={blog.featured_image} alt={blog.title} className="w-full h-40 object-cover rounded-md mt-2" />
                )}
                <p className="text-gray-700 mt-2">{blog.content.substring(0, 100)}...</p>
                <Link href={`/blog/${blog.slug}`} className="text-blue-600 hover:underline mt-2 block">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default BlogList;
