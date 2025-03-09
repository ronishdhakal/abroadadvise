import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import BlogHeader from "./BlogHeader";
import BlogBody from "./BlogBody";
import BlogComment from "./BlogComment";

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Fetch Blog Post by Slug
  useEffect(() => {
    if (slug) {
      const fetchBlog = async () => {
        try {
          console.log(`Fetching blog from: ${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}/`);
          if (!response.ok) throw new Error("Blog post not found");
          const data = await response.json();
          console.log("Fetched Blog Data:", data);
          setBlog(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchBlog();
    }
  }, [slug]);

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
            {error && <p className="text-center text-red-500">Error: {error}</p>}
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
