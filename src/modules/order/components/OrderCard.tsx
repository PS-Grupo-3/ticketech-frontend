import { useState, useEffect } from "react";
import "./OrderCard.css";

interface TicketDetail {
    detailId: string;
    eventSeatId?: string | null;
    unitPrice: number;
    quantity: number;
    eventSectorId: string;
}

interface OrderCardProps {
    orderId: string;
    eventId: string;
    thumbnailUrl: string | null;
    eventName: string;
    eventColor: string;
    details: TicketDetail[];
    isFlipped: boolean;
    onFlip: () => void;
    onClick: () => void;
}

export default function OrderCard({ orderId, thumbnailUrl, eventName, eventColor, details, isFlipped, onFlip, onClick }: OrderCardProps) {
    const [snapshot, setSnapshot] = useState<any[]>([]);

    useEffect(() => {
        const raw = localStorage.getItem(`order_snapshot_${orderId}`);
        if (raw) {
            try {
                setSnapshot(JSON.parse(raw));
            } catch {
                setSnapshot([]);
            }
        }
    }, [orderId]);

    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFlip();
    };

    const handleDetailsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick();
    };

    // Agrupar tickets usando el snapshot guardado
    const groupedTickets = snapshot.reduce((acc, snapItem, idx) => {
        if (!snapItem.eventSeatId) {
            // Admisión general - agrupar por sector
            const sectorName = snapItem.sectorName || "Sector General";
            if (!acc[sectorName]) {
                acc[sectorName] = { count: 0, isGeneral: true };
            }
            acc[sectorName].count += 1;
        } else {
            // Asiento asignado
            const key = `seat_${idx}`;
            acc[key] = {
                sectorName: snapItem.sectorName || "Asiento Numerado",
                row: snapItem.row || "-",
                column: snapItem.column || "-",
                isGeneral: false,
            };
        }

        return acc;
    }, {} as any);

    return (
        <div className={`order-card-container ${isFlipped ? "flipped" : ""}`} onClick={handleCardClick}>
            <div className="order-card-inner">
                {/* Cara frontal */}
                <div className="order-card-front">
                    <div className="order-card-image-section">
                        {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt={eventName} className="order-card-image" />
                        ) : (
                            <div className="order-card-no-image">Imagen no disponible</div>
                        )}
                    </div>
                    <div className="order-card-info-section" style={{ backgroundColor: eventColor }}>
                        <div className="order-card-info-content">
                            <h3 className="order-card-event-title">{eventName}</h3>
                        </div>
                        <div className="order-card-barcode-mini">
                            <img src="/banners/barcode.jpg" alt="código de barras" />
                        </div>
                    </div>
                </div>

                {/* Cara trasera */}
                <div className="order-card-back">
                    <div className="order-card-back-header">
                        <h3>Tickets</h3>
                        <button className="order-details-btn" onClick={handleDetailsClick}>
                            Ver detalles completos
                        </button>
                    </div>
                    <div className="order-card-tickets">
                        {Object.entries(groupedTickets).map(([key, value]: [string, any], idx) => (
                            <div key={idx} className="ticket-item">
                                {value.isGeneral ? (
                                    <p>Vale por {value.count} {value.count === 1 ? 'lugar' : 'lugares'} en {key}</p>
                                ) : (
                                    <p>
                                        {value.sectorName} · Fila {value.row} · Asiento {value.column}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
