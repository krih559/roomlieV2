import { useGetAllBookingsQuery, useUpdateBookingStatusMutation } from "../state/api";
import type { BookingData } from "./MyBookingsPage";

export function AdminBookingsPage(){
    const {data: bookings = [], isLoading, isError} = useGetAllBookingsQuery(undefined)
    const [updateStatus, {isLoading: isUpdating}] = useUpdateBookingStatusMutation()

    const handleUpdate = async (id: number, newStatus: string) => {
        try{
            await updateStatus({id, status: newStatus}).unwrap()
            alert(`A foglalás sikeresen ${newStatus === 'accepted' ? 'elfogadva' : 'elutasítva'}!`);
        } catch(error: unknown){ 
            console.error("Részletes hiba: ", error);
            const err = error as { data?: unknown }; 
            alert("SZERVER HIBA!\n\n" + JSON.stringify(err?.data || error, null, 2));
        }
    }

    const getStatus = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PENDING':
                return <span className="status-badge badge-pending">Függőben</span>
            case 'ACCEPTED':
                return <span className="status-badge badge-accepted">Elfogadva</span>
            case 'DECLINED':
                return <span className="status-badge badge-rejected">Elutasítva</span>
            default:
                return <span className="status-badge badge-default">{status}</span>
        }
    }

    if(isLoading) return <div className="app-container">Foglalások betöltése...</div>
    if(isError) return <div className="app-container" style={{color: 'red'}}>Hiba történt! Csak admin felhasználók érhetik el az oldalt</div>

    return (
        <div className="app-container">
            <h1 className="bookings-header">Beérkezett foglalások</h1>
            {bookings.length === 0 ? (
                <div className="empty-state">
                    <h3>Még nem történt foglalás</h3>
                </div>
            ) : (
                <div className="bookings-grid">
                    {[...bookings].reverse().map((booking: BookingData) => (
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

                            {booking.status?.toUpperCase() === 'PENDING' && (
                                <div style={{display: 'flex', gap: '10', marginTop: '15px'}}>
                                    <button className="panel-btn"
                                        style={{flex: 1, backgroundColor: '#4caf50', color: 'white'}}
                                        onClick={() => handleUpdate(booking.id, 'accepted')}    
                                        disabled={isUpdating}
                                    >Elfogad
                                    </button>
                                    <button className="panel-btn"
                                        style={{flex: 1, backgroundColor: '#e74c3c', color: 'white'}}
                                        onClick={() => handleUpdate(booking.id, 'declined')}    
                                        disabled={isUpdating}
                                    >Elutasít
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}