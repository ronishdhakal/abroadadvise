// frontend/pages/news/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function NewsPage() {
    const [newsList, setNewsList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch news');
                }
                return response.json();
            })
            .then(data => setNewsList(data.results))
            .catch(error => setError(error.message));
    }, []);

    const getFullImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    };

    return (
        <>
            <Head>
                <title>News - Abroad Advise</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Latest News</h1>
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {newsList.map(news => (
                        <Link key={news.slug} href={`/news/${news.slug}`} className="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg">
                            {news.featured_image && (
                                <div className="w-full h-48 relative">
                                    <Image 
                                        src={getFullImageUrl(news.featured_image)} 
                                        alt={news.title} 
                                        width={500} 
                                        height={300} 
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{news.title}</h2>
                                <p className="text-gray-600">By {news.author} on {news.date}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
