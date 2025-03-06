import Link from "next/link";

const UniversityCard = ({ university }) => {
    return (
        <div className="bg-white border rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            {university.logo && (
                <img 
                    src={university.logo}  
                    alt={university.name} 
                    className="h-24 w-24 object-cover rounded-full mb-4"
                    onError={(e) => e.target.style.display = 'none'}
                />
            )}
            <h2 className="text-xl font-semibold">{university.name}</h2>
            <p className="text-gray-500">{university.country}</p>
            <Link href={`/university/${university.slug}`} className="mt-4 text-blue-600 font-medium hover:underline">
                View Details →
            </Link>
        </div>
    );
};

export default UniversityCard;