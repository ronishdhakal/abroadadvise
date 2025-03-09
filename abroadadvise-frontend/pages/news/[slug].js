import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import NewsHeader from "./NewsHeader";
import NewsBody from "./NewsBody";
import NewsRelated from "./NewsRelated";
import NewsComment from "./NewsComment";

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      const fetchNews = async () => {
        try {
          console.log(`Fetching news from: ${process.env.NEXT_PUBLIC_API_URL}/news/${slug}/`);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${slug}/`);
          if (!response.ok) throw new Error("News not found");
          const data = await response.json();
          console.log("Fetched News Data:", data);
          setNews(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchNews();
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      const fetchRelatedNews = async () => {
        try {
          console.log(`Fetching related news from: ${process.env.NEXT_PUBLIC_API_URL}/news/related/${slug}/`);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/related/${slug}/`);
          if (!response.ok) throw new Error("Failed to fetch related news");
          const data = await response.json();
          console.log("Fetched Related News Data:", data.results);
          setRelatedNews(data.results || []);
        } catch (error) {
          console.error("Error fetching related news:", error);
        }
      };

      fetchRelatedNews();
    }
  }, [slug]);

  return (
    <>
      <Head>
        <title>{news ? news.title : "News Details"} - Abroad Advise</title>
      </Head>
      <Header />

      <div className="container mx-auto py-8 px-4 lg:px-0">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ✅ Main Content Area */}
          <div className="w-full lg:w-3/4 space-y-8">
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            {news && (
              <>
                <NewsHeader news={news} />
                <NewsBody news={news} />
                <NewsComment newsSlug={slug} />
              </>
            )}
          </div>

          {/* ✅ Right Sidebar */}
          <aside className="w-full lg:w-1/4">
            {relatedNews.length > 0 && <NewsRelated relatedNews={relatedNews} />}
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
