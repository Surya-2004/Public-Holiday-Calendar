import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PublicHolidayPage = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://public-holiday-calendar.onrender.com/api/countries");
        setCountries(response.data);
      } catch (err) {
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg py-4">
        <h1 className="text-3xl font-bold text-center text-blue-400">
          Global Public Holiday Explorer 🌍
        </h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center">
            <p className="text-lg">Loading countries...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {countries.map((country) => (
              <Link
              to={`/calendar/${country.code}/${country.name}`}
              key={country.id}
              className="hover:scale-105 transform transition-all duration-300 hover:shadow-blue-500/50 flex flex-col items-center justify-center"
            >
              <img
                src={country.flag_url}
                alt={`${country.name} flag`}
                className="h-35 w-50 object-contain rounded-lg shadow-lg"
              />
              <h3 className="text-lg font-semibold mt-4 text-center">
                {country.name} ({country.code})
              </h3>
            </Link>
            
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4 text-center">
        <p className="text-sm text-gray-400">
          Built with ❤️ | Explore holidays across the globe
        </p>
      </footer>
    </div>
  );
};

export default PublicHolidayPage;
