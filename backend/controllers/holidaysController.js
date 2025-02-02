const axios = require('axios');

const fetchHolidays = async (req, res) => {
    try {
        const { country } = req.params;
        const year = new Date().getFullYear();

        if (!/^[A-Za-z]{2}$/.test(country)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid country code format. Use 2-letter ISO code (e.g., US, IN)'
            });
        }

        const response = await axios.get('https://calendarific.com/api/v2/holidays', {
            params: {
                api_key: process.env.CALENDARIFIC_API_KEY,
                country: country.toUpperCase(),
                year,
                type: 'national'
            }
        });

        if (!response.data?.response?.holidays) {
            return res.status(500).json({
                success: false,
                error: 'Unexpected API response format'
            });
        }

        const holidays = response.data.response.holidays.map(holiday => ({
            name: holiday.name,
            date: holiday.date.iso,
            description: holiday.description || '',
            type: holiday.primary_type
        }));

        const countryName = holidays[0]?.country?.name || country.toUpperCase();

        res.json({
            success: true,
            country: countryName,
            year,
            holidays
        });

    } catch (error) {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data
        });

        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.meta?.error_detail || 'Failed to fetch holidays'
        });
    }
};

module.exports = { fetchHolidays };
