import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/header";
import Footer from "../../components/footer";
import NewsHeader from "./NewsHeader";
import NewsBody from "./NewsBody";
import NewsRelated from "./NewsRelated";
import NewsComment from "./NewsComment";
import Custom404 from "../404";

export default function NewsDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchNews = async () => {
      try {
        console.log(`Fetching news from: ${process.env.NEXT_PUBLIC_API_URL}/news/${slug}/`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${slug}/`);
        if (!response.ok) {
          setIsNotFound(true);
          return;
        }

        const data = await response.json();
        console.log("Fetched News Data:", data);
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
        setIsNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

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
        <title>{news ? news.title : "News Details"} - Abroad Advise</title>
      </Head>
      <Header />

      <div className="container mx-auto py-8 px-4 lg:px-0 flex flex-col items-center">
        {/* Main Content Container */}
        <div className="w-full max-w-4xl space-y-8 text-left">
          {news && (
            <>
              <NewsHeader news={news} />
              <NewsBody news={news} />
            </>
          )}
        </div>

        {/* Related News Container (Moved Below Main Content) */}
        {relatedNews.length > 0 && (
          <div className="w-full max-w-4xl mt-8 text-left">
            <NewsRelated relatedNews={relatedNews} />
          </div>
        )}

        {/* Comments Container */}
        <div className="w-full max-w-4xl mt-8 text-left">
          {news && <NewsComment newsSlug={slug} />}
        </div>
      </div>

      <Footer />
    </>
  );
}