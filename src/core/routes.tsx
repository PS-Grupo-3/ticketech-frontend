import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../shared/pages/HomePage";
import EventCategoryPage from "../modules/event/pages/EventCategoryPage";
import VenuePage from "../modules/venue/pages/VenuePage";
import TicketPage from "../modules/ticket/pages/TicketPage";
import OrderPage from "../modules/order/pages/OrderPage";
import AuthPage from "../modules/auth/pages/AuthPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/event" element={<EventCategoryPage />} />
                <Route path="/venue" element={<VenuePage />} />
                <Route path="/ticket" element={<TicketPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/auth" element={<AuthPage />} />
            </Routes>
        </BrowserRouter>
    );
}