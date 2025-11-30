import { BrowserRouter, Routes, Route } from "react-router-dom";
//SEGURIDAD
import ProtectedRoute from "../shared/components/ProtectedRoute";
//PUBLICO
import HomePage from "../shared/pages/Home/HomePage";
import EventPreviewPage from "../modules/event/pages/EventDetailsPage";
import EventVenuePage from "../modules/event/pages/eventoUsuario/EventVenue";
//USER
import MyOrders from "../modules/order/pages/MyOrders";
import OrderPaymentPage from "../modules/order/pages/OrderPaymentPage";
import TicketsPage from "../modules/order/pages/TicketsPage";
//ADMIN
import EventListPage from "../modules/event/pages/EventListPage";
import CreateEventPage from "../modules/event/pages/CreateEventPage";
import UpdateEventPage from "../modules/event/pages/UpdateEventPage"
import EventMetricsPage from "../modules/event/pages/metrics/EventMetricsPage";
//SUPERADMIN
import VenueEditorPage from "../modules/venue/pages/VenueEditorPage";
import VenueListPage from "../modules/venue/pages/VenueListPage";
import VenueCreatePage from "../modules/venue/pages/VenueCreatePage";
import VenuePage from "../modules/event/pages/eventoUsuario/EventVenue";
import AuthPage from "../modules/auth/pages/AuthPage";
import Dashboard from "../shared/pages/dashboard/Dashboard";


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/event/:eventId" element={<EventPreviewPage />} />
                


                
                <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/venue" element={<VenueListPage />} />
                    <Route path="/venue/create" element={<VenueCreatePage />} />
                    <Route path="/venue/editor/:venueId" element={<VenueEditorPage />} />
                    <Route path="/venue/:venueId" element={<VenuePage />} />
                    <Route path="/auth" element={<AuthPage />} />
                </Route>


          
                <Route element={<ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]} />}>
                    <Route path="/event" element={<EventListPage />} />
                    <Route path="/event/create" element={<CreateEventPage />} />
                    <Route path="/event/:eventId/update" element={<UpdateEventPage />} />
                    <Route path="/event/:eventId/metrics" element={<EventMetricsPage />} />
                </Route>


                
                <Route element={<ProtectedRoute allowedRoles={["Current", "Admin", "SuperAdmin"]} />}>
                    <Route path="/order/my-orders" element={<MyOrders />} />
                    <Route path="/tickets" element={<TicketsPage />} />
                    <Route path="/order/:orderId/pay" element={<OrderPaymentPage />} />
                    <Route path="/event/:eventId/venue" element={<EventVenuePage />} />
                    
                </Route>

            </Routes>
        </BrowserRouter>
    );
}