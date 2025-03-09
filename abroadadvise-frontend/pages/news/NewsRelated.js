import Link from "next/link";
import Image from "next/image";

const NewsRelated = ({ relatedNews }) => {
  if (!relatedNews || relatedNews.length === 0) {
    console.log("No related news available."); // Debugging
    return null;
  }

  console.log("Related News Data:", relatedNews); // Debugging

  return (
    <aside className="w-full md:w-72 bg-white shadow-lg rounded-xl p-4 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h2>

      <div className="space-y-4">
        {relatedNews.slice(0, 5).map((news) => {
          const imageUrl = news.featured_image_url
            ? news.featured_image_url.startsWith("http")
              ? news.featured_image_url
              : `${process.env.NEXT_PUBLIC_API_URL}${news.featured_image_url}`
            : null;

          return (
            <div key={news.slug} className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
              <Link href={`/news/${news.slug}`}>
                <div>
                  {/* News Image */}
                  <div className="relative w-full h-28 bg-gray-200">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={news.title}
                        layout="fill"
                        objectFit="cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                        No Image
                      </div>
                    )}

                    {/* Category Badge */}
                    {news.category?.name && (
                      <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        {news.category.name}
                      </div>
                    )}
                  </div>

                  {/* News Title */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {news.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default NewsRelated;
