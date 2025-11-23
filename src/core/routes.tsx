import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../shared/pages/Home/HomePage";
import OrderPage from "../modules/order/pages/OrderPage";
import MyOrders from "../modules/order/pages/MyOrders";
import AuthPage from "../modules/auth/pages/AuthPage";
import VenueEditorPage from "../modules/venue/pages/VenueEditorPage";
import VenueListPage from "../modules/venue/pages/VenueListPage";
import VenueCreatePage from "../modules/venue/pages/VenueCreatePage";
import EventListPage from "../modules/event/pages/EventListPage";
import CreateEventPage from "../modules/event/pages/CreateEventPage";
import VenuePage from "../modules/event/pages/eventoUsuario/EventVenue";
import Dashboard from "../shared/pages/dashboard/Dashboard";
import EventPreviewPage from "../modules/event/pages/EventDetailsPage";
import EventVenuePage from "../modules/event/pages/eventoUsuario/EventVenue";
import OrderPaymentPage from "../modules/order/pages/OrderPaymentPage";
import TicketsPage from "../modules/order/pages/TicketsPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />                
                <Route path="/order" element={<OrderPage />} />
                <Route path="/myOrders" element={<MyOrders />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/venue" element={<VenueListPage />} />
                <Route path="/venue/create" element={<VenueCreatePage />} />
                <Route path="/venue/editor/:venueId" element={<VenueEditorPage />} />
                <Route path="/event" element={<EventListPage />} />
                <Route path="/event/create" element={<CreateEventPage />} />                
                <Route path="/dashboard" element={<Dashboard />} />                
                <Route path="/venue/:venueId" element={<VenuePage />} />
                <Route path="/event/:eventId" element={<EventPreviewPage />} />
                <Route path="/event/:eventId/venue" element={<EventVenuePage />} />
                <Route path="/order/:orderId/pay" element={<OrderPaymentPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
            </Routes>
        </BrowserRouter>
    );
}