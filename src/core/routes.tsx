import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../shared/pages/HomePage";
import EventCategoryPage from "../modules/event/pages/EventCategoryPage";
import TicketPage from "../modules/ticket/pages/TicketPage";
import OrderPage from "../modules/order/pages/OrderPage";
import AuthPage from "../modules/auth/pages/AuthPage";
import VenueEditorPage from "../modules/venue/pages/VenueEditorPage";
import VenueListPage from "../modules/venue/pages/VenueListPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/event" element={<EventCategoryPage />} />
                <Route path="/ticket" element={<TicketPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/venue" element={<VenueListPage />} />
                <Route path="/venue/editor/:venueId" element={<VenueEditorPage />} />
            </Routes>
        </BrowserRouter>
    );
}