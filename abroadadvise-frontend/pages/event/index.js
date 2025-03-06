// frontend/pages/event/index.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import Header from '../../components/header'; // ✅ Fixed Import
import Footer from '../../components/footer'; // ✅ Fixed Import

export default function Events() {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                return response.json();
            })
            .then(data => setEvents(data.results))
            .catch(error => setError(error.message));
    }, []);

    const getFullImageUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    };

    return (
        <>
            <Head>
                <title>Events - Abroad Advise</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
                {error && <p className="text-center text-red-500">Error: {error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <Link key={event.slug} href={`/event/${event.slug}`} className="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg">
                            {event.featured_image && (
                                <div className="w-full h-48 relative">
                                    <Image 
                                        src={getFullImageUrl(event.featured_image)} 
                                        alt={event.name} 
                                        width={500} 
                                        height={300} 
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold">{event.name}</h2>
                                <p className="text-gray-600">{event.date} - {event.event_type}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}
