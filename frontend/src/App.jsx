import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import PublicHolidayPage from "./components/PublicHolidayPage";
import HolidayCalendar from "./components/HolidayCalender";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<PublicHolidayPage />} />
      <Route
        path="/calendar/:countryCode/:countryName"
        element={<RenderHolidayCalendar />}
      />
    </Routes>
  </Router>
);

const RenderHolidayCalendar = () => {
  const params = useParams();
  const { countryCode, countryName } = params;

  return <HolidayCalendar countryCode={countryCode} countryName={countryName} />;
};

export default App;
