import Link from "next/link";

const ConsultancyCard = ({ exam }) => {
  return (
    <Link href={`/exam/${exam.slug}`} passHref>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 p-5 cursor-pointer flex flex-col items-center">
        
        {/* 📌 Exam Icon */}
        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
          {exam.icon ? (
            <img
              src={exam.icon}
              alt={exam.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-gray-400">No Icon</span>
          )}
        </div>

        {/* 📖 Exam Name */}
        <h2 className="mt-4 text-lg font-semibold text-center text-gray-900">{exam.name}</h2>
      </div>
    </Link>
  );
};

export default ConsultancyCard;
