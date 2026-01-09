import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import EventForm from './pages/EventForm';
import EventDetail from './pages/EventDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/event-form" element={<EventForm />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
