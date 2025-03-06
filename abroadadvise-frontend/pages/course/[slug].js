// frontend/pages/course/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/header'; // ✅ Fixed Import
import Footer from '../../components/footer'; // ✅ Fixed Import
import Link from 'next/link';

export default function CourseDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [course, setCourse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (slug) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/${slug}/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Course not found');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched Course Data:", data); // ✅ Debugging Log
                    setCourse(data);
                })
                .catch(error => setError(error.message));
        }
    }, [slug]);
    

    return (
        <>
            <Head>
                <title>{course ? course.name : "Course Details"} - Abroad Advise</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8">
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                {course && (
                    <>
                        <h1 className="text-4xl font-bold mb-4">{course.name} ({course.abbreviation})</h1>
                        {course.cover_image && (
                            <div className="w-full h-64 relative mb-6">
                                <Image 
                                    src={course.cover_image.startsWith("http") ? course.cover_image : `${process.env.NEXT_PUBLIC_API_URL}${course.cover_image}`} 
                                    alt={course.name} 
                                    width={800} 
                                    height={400} 
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <p className="text-lg text-gray-700 mb-4">{course.short_description}</p>
                        <p><strong>Duration:</strong> {course.duration}</p>
                        <p><strong>Level:</strong> {course.level}</p>
                        <p><strong>Fee:</strong> {course.fee}</p>
                        {course.university && course.university.slug ? (
                            <p><strong>University:</strong> <Link href={`/university/${course.university.slug}`} className="text-blue-500 underline">{course.university.name}</Link></p>
                        ) : (
                            <p><strong>University:</strong> Not Available</p>
                        )}
                        {course.icon && (
                            <div className="mt-4">
                                <Image 
                                    src={course.icon.startsWith("http") ? course.icon : `${process.env.NEXT_PUBLIC_API_URL}${course.icon}`} 
                                    alt="Course Icon" 
                                    width={100} 
                                    height={100} 
                                    className="object-contain"
                                />
                            </div>
                        )}
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold">Eligibility</h2>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.eligibility }} />
                        </div>
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold">Course Structure</h2>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.course_structure }} />
                        </div>
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold">Job Prospects</h2>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.job_prospects }} />
                        </div>
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold">Scholarship Opportunities</h2>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.scholarship }} />
                        </div>
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold">Key Features</h2>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.features }} />
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}
