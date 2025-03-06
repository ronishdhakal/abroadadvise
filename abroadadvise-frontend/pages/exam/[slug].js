// frontend/pages/exam/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Link from 'next/link';

export default function ExamDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [exam, setExam] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (slug) {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/exam/${slug}/`;
            console.log("Fetching Exam Data from:", apiUrl);
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Exam not found');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched Exam Data:", data);
                    setExam(data);
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
                <title>{exam ? exam.name : "Exam Details"} - Abroad Advise</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8">
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                {exam && (
                    <>
                        <h1 className="text-4xl font-bold mb-4">{exam.name}</h1>
                        {exam.icon && (
                            <div className="w-full h-64 relative mb-6">
                                <Image 
                                    src={getFullImageUrl(exam.icon)} 
                                    alt={exam.name} 
                                    width={800} 
                                    height={400} 
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <p className="text-lg text-gray-700 mb-4">{exam.short_description}</p>
                        <p><strong>Exam Fee:</strong> ${exam.exam_fee}</p>
                        <p><strong>Type:</strong> {exam.type}</p>
                        <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: exam.exam_centers }} />
                        <div className="prose max-w-none mt-6" dangerouslySetInnerHTML={{ __html: exam.about }} />
                        {exam.preparation_classes && exam.preparation_classes.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold">Preparation Classes Available</h2>
                                <ul className="list-disc pl-5">
                                    {exam.preparation_classes.map((cons, index) => (
                                        <li key={index}><Link href={`/consultancy/${cons.slug || '#'}`} className="text-blue-500 underline">{cons.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {exam.similar_exams && exam.similar_exams.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold">Similar Exams</h2>
                                <ul className="list-disc pl-5">
                                    {exam.similar_exams.map((simExam, index) => (
                                        <li key={index}><Link href={`/exam/${simExam.slug || '#'}`} className="text-blue-500 underline">{simExam.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}