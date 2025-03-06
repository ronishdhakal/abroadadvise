// frontend/pages/news/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function NewsDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [news, setNews] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (slug) {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/news/${slug}/`;
            console.log("Fetching News Data from:", apiUrl);
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('News not found');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched News Data:", data);
                    setNews(data);
                })
                .catch(error => setError(error.message));
        }
    }, [slug]);

    const getFullImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    };

    return (
        <>
            <Head>
                <title>{news ? news.title : "News Details"} - Abroad Advise</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8">
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                {news && (
                    <>
                        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
                        <p className="text-gray-600 mb-2">By {news.author} on {news.date}</p>
                        {news.featured_image && (
                            <div className="w-full h-64 relative mb-6">
                                <Image 
                                    src={getFullImageUrl(news.featured_image)} 
                                    alt={news.title} 
                                    width={800} 
                                    height={400} 
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: news.detail }} />
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}