import { useState, useEffect } from "react";
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

  const fetchHolidays = async (year) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://public-holiday-calendar.onrender.com/api/holidays/${countryCode}/${year}`
      );
      setHolidays(response.data.holidays);
      setMarkedDates(response.data.holidays.map((holiday) => new Date(holiday.date)));
      setError("");
    } catch (err) {
      setError("Failed to fetch holiday data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays(selectedDate.getFullYear());
  }, [countryCode, selectedDate.getFullYear()]);

  const isHoliday = (date) =>
    markedDates.some((markedDate) => markedDate.toDateString() === date.toDateString());

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const holidaysForSelectedDate = holidays.filter((holiday) =>
      new Date(holiday.date).toDateString() === date.toDateString()
    );
    setSelectedHolidays(holidaysForSelectedDate);
  };

  useEffect(() => {
    handleDateClick(new Date());
  }, [holidays]);

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
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) {
                  const newYear = activeStartDate.getFullYear();
                  if (newYear !== selectedDate.getFullYear()) {
                    fetchHolidays(newYear);
                  }
                }
              }}
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
