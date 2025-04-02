import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import BlogHeader from "./BlogHeader";
import BlogBody from "./BlogBody";
import BlogComment from "./BlogComment";
import Custom404 from "../404";

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        console.log(`Fetching blog from: ${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`);

        if (!response.ok) {
          setIsNotFound(true);
          return;
        }

        const data = await response.json();
        console.log("Fetched Blog Data:", data);
        setBlog(data);
      } catch (error) {
        console.error("Blog Fetch Error:", error);
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return <p className="text-center text-lg font-semibold mt-10">Loading...</p>;
  }

  if (isNotFound) {
    return <Custom404 />;
  }

  return (
    <>
      <Head>
        <title>{blog ? blog.title : "Blog Details"} - Abroad Advise</title>
      </Head>
      <Header />

      <div className="container mx-auto py-8 px-4 lg:px-0 flex flex-col items-center">
        {/* Main Content Container */}
        <div className="w-full max-w-4xl space-y-8 text-left">
          {blog && (
            <>
              <BlogHeader blog={blog} />
              <BlogBody blog={blog} />
              <BlogComment blogSlug={slug} />
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}