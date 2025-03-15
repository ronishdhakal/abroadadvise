import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import BlogHeader from "./BlogHeader";
import BlogBody from "./BlogBody";
import BlogComment from "./BlogComment";
import Custom404 from "../404"; // ✅ Import 404 Page

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false); // ✅ Track 404 state

  // ✅ Fetch Blog Post by Slug
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        console.log(`Fetching blog from: ${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`);

        if (!response.ok) {
          setIsNotFound(true); // ✅ Instead of throwing an error, mark as 404
          return;
        }

        const data = await response.json();
        console.log("Fetched Blog Data:", data);
        setBlog(data);
      } catch (error) {
        console.error("Blog Fetch Error:", error);
        setIsNotFound(true); // ✅ Mark as 404 if API call fails
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  // ✅ Show loading while fetching
  if (loading) {
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  }

  // ✅ Show 404 page if the blog is not found
  if (isNotFound) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{blog ? blog.title : "Blog Details"} - Abroad Advise</title>
      </Head>
      <Header />

      <div className="container mx-auto py-8 px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ✅ Main Content Area */}
          <div className="w-full lg:w-3/4 space-y-8">
            {blog && (
              <>
                <BlogHeader blog={blog} />
                <BlogBody blog={blog} />
                <BlogComment blogSlug={slug} />
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
