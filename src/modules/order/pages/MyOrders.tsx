import "../styles/MyOrdersPage.css";
import { useState, useEffect } from "react";
import { getOrders } from "../api/getOrders";
import { getOrdersDetails } from "../api/getOrderDetails";
import OrderDetailsRender from "./OrderDetail";
import { getEventById } from "../../event/api/eventApi";
import "../styles/OrderDetailModal.css";
import "../styles/EventInfo.css";
import OrderCard from "../components/OrderCard";
import Layout from "../../../shared/components/Layout";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginSidebar from "../../auth/pages/LoginSB";

interface Order {
    orderId: string;
    eventId: string;
    totalAmount: number;
    transaction: string;
}

interface OrderWithDetails extends Order {
    details: any[];
}

export default function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState(false);
    const [selectOrder, setSelectOrder] = useState<string | null>(null);
    const [eventInfo, setEventInfo] = useState<{ [eventId: string]: { thumbnail: string | null, name: string, color: string } }>({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [flippedOrderId, setFlippedOrderId] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    // Auto-flip back timer
    useEffect(() => {
        if (flippedOrderId) {
            const timer = setTimeout(() => {
                setFlippedOrderId(null);
            }, 5000); // 5 segundos para volver al estado original
            return () => clearTimeout(timer);
        }
    }, [flippedOrderId]);

    const handleCardFlip = (orderId: string) => {
        setFlippedOrderId(prev => prev === orderId ? null : orderId);
    };

    const loadOrders = async () => {
        try {
            const data = await getOrders();
            const orderArray = Array.isArray(data) ? data : [];

            // Cargar detalles de cada orden
            const ordersWithDetails = await Promise.all(
                orderArray.map(async (order) => {
                    try {
                        const details = await getOrdersDetails(order.orderId);
                        return { ...order, details: details.details || [] };
                    } catch (err) {
                        console.error("Error al cargar detalles de orden:", err);
                        return { ...order, details: [] };
                    }
                })
            );

            setOrders(ordersWithDetails);

            // Cargar info de eventos
            const info: { [eventId: string]: { thumbnail: string | null, name: string, color: string } } = {};
            await Promise.all(
                orderArray.map(async (order) => {
                    try {
                        const event = await getEventById(order.eventId);

                        // Si el color es blanco o no existe, usar default para asegurar contraste con texto blanco
                        const isWhite = event.themeColor?.toLowerCase() === '#ffffff' || event.themeColor?.toLowerCase() === '#fff';
                        const finalColor = (event.themeColor && !isWhite) ? event.themeColor : "#1e40af";

                        info[order.eventId] = {
                            thumbnail: event.bannerImageUrl,
                            name: event.name,
                            color: finalColor
                        };
                    } catch (err) {
                        console.error("Error al cargar info del evento", err);
                        info[order.eventId] = { thumbnail: null, name: "Evento desconocido", color: "#333" };
                    }
                })
            );
            setEventInfo(info);
        } catch (err: any) {
            console.error("Failed to load orders:", err);
            if (err.response && err.response.status === 401) {
                setShowLoginModal(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="MyOrdersPage">
                <div className="tittle relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-4 p-2 hover:bg-neutral-800 rounded-full transition-colors text-white"
                        title="Volver"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Mis compras</h1>
                </div>
                <div className="OrdersContainer">
                    {orders.length === 0 && (
                        <p>Aún no hay ordenes realizadas....</p>
                    )}
                    {orders.map((order, index) => (
                        <OrderCard
                            key={order.orderId || index}
                            orderId={order.orderId}
                            eventId={order.eventId}
                            thumbnailUrl={eventInfo[order.eventId]?.thumbnail || null}
                            eventName={eventInfo[order.eventId]?.name || "Cargando..."}
                            eventColor={eventInfo[order.eventId]?.color || "#333"}
                            details={order.details}
                            isFlipped={flippedOrderId === order.orderId}
                            onFlip={() => handleCardFlip(order.orderId)}
                            onClick={() => {
                                setSelectOrder(order.orderId);
                                setModalState(true);
                                document.body.classList.add("active");
                            }}
                        />
                    ))}
                </div>
                {modalState && selectOrder && (
                    <div className="modalOverlay" onClick={() =>{
                            setModalState(false);
                            document.body.classList.remove("active");
                    } }>
                        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                            <OrderDetailsRender orderId={selectOrder}
                            onClose={() => {
                    setModalState(false);
                    document.body.classList.remove("active");
                }} />
                        </div>
                    </div>
                )}

                <LoginSidebar
                    open={showLoginModal}
                    onClose={() => {
                        setShowLoginModal(false);
                        loadOrders(); // Reintentar cargar ordenes al cerrar (asumiendo login exitoso)
                    }}
                />
            </div>
        </Layout>
    );
}