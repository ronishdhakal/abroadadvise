// frontend/pages/event/[slug].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../../components/header'; // ✅ Fixed Import
import Footer from '../../components/footer'; // ✅ Fixed Import
import Link from 'next/link';

export default function EventDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (slug) {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/event/${slug}/`;
            console.log("Fetching Event Data from:", apiUrl); // ✅ Debugging Log
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Event not found');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched Event Data:", data); // ✅ Debugging Log
                    setEvent(data);
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
                <title>{event ? event.name : "Event Details"} - Abroad Advise</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8">
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                {event && (
                    <>
                        <h1 className="text-4xl font-bold mb-4">{event.name}</h1>
                        {event.featured_image && (
                            <div className="w-full h-64 relative mb-6">
                                <Image 
                                    src={getFullImageUrl(event.featured_image)} 
                                    alt={event.name} 
                                    width={800} 
                                    height={400} 
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        <p className="text-lg text-gray-700 mb-4">{event.description}</p>
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Time:</strong> {event.time}</p>
                        <p><strong>Duration:</strong> {event.duration}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Event Type:</strong> {event.event_type}</p>
                        <p><strong>Registration Type:</strong> {event.registration_type} {event.price && `- $${event.price}`}</p>
                        {event.organizer && (
                            <p><strong>Organizer:</strong> <Link href={`/consultancy/${event.organizer.slug}`} className="text-blue-500 underline">{event.organizer.name}</Link></p>
                        )}
                        {event.related_universities.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold">Related Universities</h2>
                                <ul className="list-disc pl-5">
                                    {event.related_universities.map(uni => (
                                        <li key={uni.slug}><Link href={`/university/${uni.slug}`} className="text-blue-500 underline">{uni.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {event.related_consultancies.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold">Related Consultancies</h2>
                                <ul className="list-disc pl-5">
                                    {event.related_consultancies.map(cons => (
                                        <li key={cons.slug}><Link href={`/consultancy/${cons.slug}`} className="text-blue-500 underline">{cons.name}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {event.targeted_destinations.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold">Targeted Destinations</h2>
                                <ul className="list-disc pl-5">
                                    {event.targeted_destinations.map(dest => (
                                        <li key={dest.slug}><Link href={`/destination/${dest.slug}`} className="text-blue-500 underline">{dest.title}</Link></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {event.gallery_images.length > 0 && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold">Event Gallery</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {event.gallery_images.map(image => (
                                        <Image 
                                            key={image.id} 
                                            src={getFullImageUrl(image.image_url)} 
                                            alt="Event Gallery Image" 
                                            width={300} 
                                            height={200} 
                                            className="rounded-lg object-cover"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}