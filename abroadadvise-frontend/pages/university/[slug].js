import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/header";  // Import Header
import Footer from "@/components/footer";  // Import Footer

export async function getServerSideProps({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/university/${params.slug}/`);
    const university = await res.json();

    return {
        props: { university },
    };
}

export default function UniversityDetail({ university }) {
    const router = useRouter();

    if (!university) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Header /> {/* Include Header */}
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold">{university.name}</h1>
                
                {/* Logo and Cover Photo */}
                <div className="flex items-center space-x-4 mb-6">
                    <img 
                        src={`${process.env.NEXT_PUBLIC_API_URL}${university.logo}`} 
                        alt={university.name} 
                        className="h-20 w-20 object-cover" 
                    />
                    <h2 className="text-xl font-semibold">{university.name} ({university.type})</h2>
                </div>
                <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${university.cover_photo}`} 
                    alt={university.name} 
                    className="w-full h-60 object-cover mt-4 rounded-lg" 
                />
                
                {/* University Description */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">About</h2>
                    <p className="text-gray-700">{university.about}</p>
                </div>

                {/* Eligibility Criteria */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Eligibility</h2>
                    <div 
                        className="text-gray-700" 
                        dangerouslySetInnerHTML={{ __html: university.eligibility || "" }} 
                    />
                </div>

                {/* Facilities Features */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Facilities</h2>
                    <div 
                        className="text-gray-700" 
                        dangerouslySetInnerHTML={{ __html: university.facilities_features || "" }} 
                    />
                </div>

                {/* Scholarships */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Scholarships</h2>
                    <div 
                        className="text-gray-700" 
                        dangerouslySetInnerHTML={{ __html: university.scholarship || "" }} 
                    />
                </div>

                {/* Tuition Fees */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Tuition Fees</h2>
                    <p className="text-gray-700">{university.tuition_fees || "N/A"}</p>
                </div>

                {/* Courses */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Courses Offered</h2>
                    <ul className="list-disc ml-5">
                        {university.courses && university.courses.length > 0 ? (
                            university.courses.map((course) => (
                                <li key={course.id}>{course.name}</li>
                            ))
                        ) : (
                            <li>No courses available</li>
                        )}
                    </ul>
                </div>

                {/* Contact Information */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                    <p>📍 Address: {university.address}</p>
                    <p>📞 Phone: {university.phone}</p>
                    {university.email && <p>📧 Email: {university.email}</p>}
                    {university.website && (
                        <p>🌍 Website: <a href={university.website} target="_blank" className="text-blue-600">{university.website}</a></p>
                    )}
                </div>

                {/* FAQs */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">FAQs</h2>
                    <div 
                        className="text-gray-700" 
                        dangerouslySetInnerHTML={{ __html: university.faqs || "" }} 
                    />
                </div>
            </div>
            <Footer /> {/* Include Footer */}
        </div>
    );
}
