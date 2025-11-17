import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../shared/pages/HomePage";
import EventCategoryPage from "../modules/event/pages/EventCategoryPage";
import TicketPage from "../modules/ticket/pages/TicketPage";
import OrderPage from "../modules/order/pages/OrderPage";
import AuthPage from "../modules/auth/pages/AuthPage";
import VenueEditorPage from "../modules/venue/pages/VenueEditorPage";
import VenueListPage from "../modules/venue/pages/VenueListPage";
import VenueCreatePage from "../modules/venue/pages/VenueCreatePage";
import CreateEventPage from "../modules/event/pages/CreateEventPage";
import VenueSelectionPage from "../modules/event/pages/SelectVenuePage";

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
                <Route path="/venue/create" element={<VenueCreatePage />} />
                <Route path="/venue/editor/:venueId" element={<VenueEditorPage />} />
                <Route path="/event/create" element={<CreateEventPage />} />
                <Route path="/event/select-venue" element={<VenueSelectionPage />} />

            </Routes>
        </BrowserRouter>
    );
}