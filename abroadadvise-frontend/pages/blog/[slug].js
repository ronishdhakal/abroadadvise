import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Header from "../../components/header"; // ✅ Using lowercase as per your file naming
import Footer from "../../components/footer"; // ✅ Using lowercase as per your file naming

const BlogPost = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!blog) return <p className="text-center text-red-500">Blog post not found.</p>;

  return (
    <>
      <Head>
        <title>{blog.title} - Blog</title>
      </Head>

      <Header />

      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold">{blog.title}</h1>
        <p className="text-gray-500 text-sm mt-2">
          By {blog.author_name} • {new Date(blog.published_date).toLocaleDateString()}
        </p>
        {blog.featured_image && (
          <img src={blog.featured_image} alt={blog.title} className="w-full h-60 object-cover rounded-md mt-4" />
        )}
        <div className="mt-6 text-gray-800" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <Link href="/blog" className="mt-6 inline-block text-blue-600 hover:underline">
          ← Back to Blog
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default BlogPost;
