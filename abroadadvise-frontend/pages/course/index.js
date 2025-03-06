import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '../../components/header'; // ✅ Fixed Import
import Footer from '../../components/footer'; // ✅ Fixed Import

export default function Courses() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                return response.json();
            })
            .then(data => setCourses(data.results))
            .catch(error => setError(error.message));
    }, []);

    return (
        <>
            <Head>
                <title>Courses - Abroad Advise</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Courses</h1>
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Link key={course.slug} href={`/course/${course.slug}`} className="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg">
                            {course.cover_image && (
                                <div className="w-full h-48 relative">
                                    <Image 
                                        src={course.cover_image.startsWith("http") ? course.cover_image : `${process.env.NEXT_PUBLIC_API_URL}${course.cover_image}`} 
                                        alt={course.name} 
                                        width={500} 
                                        height={300} 
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{course.name}</h2>
                                <p className="text-gray-600">{course.short_description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}