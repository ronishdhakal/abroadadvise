// frontend/pages/exam/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function Exams() {
    const [exams, setExams] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch exams');
                }
                return response.json();
            })
            .then(data => setExams(data.results))
            .catch(error => setError(error.message));
    }, []);

    const getFullImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    };

    return (
        <>
            <Head>
                <title>Exams - Abroad Advise</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Exams</h1>
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map(exam => (
                        <Link key={exam.slug} href={`/exam/${exam.slug}`} className="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg">
                            {exam.icon && (
                                <div className="w-full h-48 relative">
                                    <Image 
                                        src={getFullImageUrl(exam.icon)} 
                                        alt={exam.name} 
                                        width={500} 
                                        height={300} 
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{exam.name}</h2>
                                <p className="text-gray-600">{exam.short_description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}