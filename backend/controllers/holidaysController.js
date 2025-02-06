const axios = require('axios');

const fetchHolidays = async (req, res) => {
    try {
        const { country, year } = req.params;
        const queryYear = year ? parseInt(year, 10) : new Date().getFullYear();

        if (!/^[A-Za-z]{2}$/.test(country)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid country code format. Use a 2-letter ISO code (e.g., US, IN).'
            });
        }

        if (isNaN(queryYear) || queryYear < 1900 || queryYear > 2100) {
            return res.status(400).json({
                success: false,
                error: 'Invalid year. Provide a valid year between 1900 and 2100.'
            });
        }

        const response = await axios.get('https://calendarific.com/api/v2/holidays', {
            params: {
                api_key: process.env.CALENDARIFIC_API_KEY,
                country: country.toUpperCase(),
                year: queryYear,
                type: 'national'
            }
        });

        if (!response.data?.response?.holidays) {
            return res.status(500).json({
                success: false,
                error: 'Unexpected API response format.'
            });
        }

        const holidays = response.data.response.holidays.map(holiday => ({
            name: holiday.name,
            date: holiday.date.iso,
            description: holiday.description || 'No description available',
            type: holiday.primary_type || 'N/A'
        }));

        res.json({
            success: true,
            country: country.toUpperCase(),
            year: queryYear,
            holidays
        });

    } catch (error) {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data
        });

        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.meta?.error_detail || 'Failed to fetch holidays.'
        });
    }
};

module.exports = { fetchHolidays };
