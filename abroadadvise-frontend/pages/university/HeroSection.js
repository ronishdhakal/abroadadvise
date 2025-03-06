const HeroSection = ({ title, subtitle }) => {
    return (
        <div className="bg-blue-600 text-white text-center py-16">
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="mt-2 text-lg">{subtitle}</p>
        </div>
    );
};
