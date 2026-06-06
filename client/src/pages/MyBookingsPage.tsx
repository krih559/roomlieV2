import { useGetMyBookingsQuery } from "../state/api";

export interface BookingData {
    id: number;
        tableId: number;
        date: string;
        startTime: string;
        endTime: string;
        headcount: number;
        name: string;
        email: string;
        phone: string;
        notes?: string;
        status: string;    
}

export function MyBookingsPage(){
    const {data: bookings = [], isLoading, isError} = useGetMyBookingsQuery(undefined)

    const getStatus = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return <span className="status-badge badge-pending">Függőben</span>
            case 'ACCEPTED':
                return <span className="status-badge badge-accepted">Elfogadva</span>
            case 'DECLINED':
                return <span className="status-badge badge-rejected">Elutasítva</span>
            default:
                return <span className="status-badge badge-">{status}</span>
        }
    }
    if (isLoading) return <div className="app-container">Foglalások betöltése...</div>
    if (isError) return <div className="app-container">Hiba történt a foglalások betöltésekor</div>

    return(
        <div className="app-container">
            <h1 className="bookings-header">Saját foglalásaim</h1>
            {bookings.length === 0 ? (
                <div className="empty-state">
                    <h3>Még nincs egyetlen foglalásod sem</h3>
                </div>
            ): (
                <div className="bookings-grid">
                    {bookings.map((booking: BookingData) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-card-header">
                                <strong className="booking-table-id">Asztal #{booking.tableId}</strong>
                                {getStatus(booking.status)}
                            </div>

                            <div className="booking-details"> 
                                <div><strong>Dátum: </strong>{booking.date}</div>
                                <div><strong>Időpont: </strong>{booking.startTime} - {booking.endTime}</div>
                                <div><strong>Létszám: </strong>{booking.headcount} fő</div>
                                <hr className="form-divider" />
                                <div><strong>Név: </strong>{booking.name}</div>
                                <div><strong>E-mail: </strong>{booking.email}</div>
                                <div><strong>Telefon: </strong>{booking.phone}</div>
                            </div>

                            {booking.notes && (
                                <div className="booking-notes">
                                    <em>{booking.notes}</em>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}