import { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./HolidayCalender.css";
import axios from "axios";

const HolidayCalendar = ({ countryCode, countryName }) => {
  const [holidays, setHolidays] = useState([]);
  const [markedDates, setMarkedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHolidays = useCallback(async (year) => {
    try {
      setLoading(true);
      setError(""); // Clear previous error

      const response = await axios.get(
        `https://public-holiday-calendar.onrender.com/api/holidays/${encodeURIComponent(countryCode)}/${year}`
      );

      if (response.data && response.data.holidays) {
        const holidayDates = response.data.holidays.map((holiday) => new Date(holiday.date));
        setHolidays(response.data.holidays);
        setMarkedDates(holidayDates);
      } else {
        setHolidays([]);
        setMarkedDates([]);
      }
    } catch (err) {
      setError("Failed to fetch holiday data. Please try again later.");
      setHolidays([]);
      setMarkedDates([]);
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  // Fetch holidays on mount and whenever the countryCode changes.
  useEffect(() => {
    fetchHolidays(selectedDate.getFullYear());
  }, [fetchHolidays]); // Removed selectedDate dependency

  const isHoliday = (date) =>
    markedDates.some((markedDate) => markedDate.toDateString() === date.toDateString());

  const handleDateClick = useCallback((date) => {
    setSelectedDate(date);
    setSelectedHolidays(
      holidays.filter((holiday) => 
        new Date(holiday.date).toDateString() === date.toDateString()
      )
    );
  }, [holidays]);

  // Removed the useEffect that resets the selectedDate to new Date()

  // Handling year change on calendar navigation.
  const handleYearChange = ({ activeStartDate }) => {
    const newYear = activeStartDate.getFullYear();
    if (newYear !== selectedDate.getFullYear()) {
      const newDate = new Date(newYear, 0, 1); // Force January 1st of the new year.
      setSelectedDate(newDate);
      fetchHolidays(newYear);  // Fetch new year's holidays.
    }
  };

  return (
    <div className="holiday-calendar-container">
      <header className="holiday-header mx-0 my-0">
        <h1>
          Public Holidays in {countryName} - {selectedDate.getFullYear()}
        </h1>
      </header>
      <div className="holiday-content mx-0 my-0">
        <div className="calendar-container">
          {loading ? (
            <p className="loading-text">Loading holidays...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : (
            <Calendar
              className="styled-calendar"
              onClickDay={handleDateClick}
              onActiveStartDateChange={handleYearChange}  // Use the year change handler here.
              value={selectedDate}
              tileClassName={({ date }) => (isHoliday(date) ? "holiday-tile" : "")}
              tileContent={({ date }) =>
                isHoliday(date) ? <div className="holiday-icon">🎉</div> : null
              }
              showNeighboringMonth={false}
              prev2Label={null}
              next2Label={null}
            />
          )}
        </div>
        <div className="holiday-details">
          {selectedDate && (
            <>
              <h2>Holidays for {selectedDate.toDateString()}</h2>
              {selectedHolidays.length > 0 ? (
                selectedHolidays.map((holiday) => (
                  <div key={holiday.name} className="holiday-item">
                    <h3>{holiday.name}</h3>
                    <p><strong>Date:</strong> {holiday.date}</p>
                    <p><strong>Description:</strong> {holiday.description || "No description available"}</p>
                    <p><strong>Type:</strong> {holiday.type || "N/A"}</p>
                  </div>
                ))
              ) : (
                <p>No holidays found for this date.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;
