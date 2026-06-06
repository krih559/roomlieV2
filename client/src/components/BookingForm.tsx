import { useState } from "react";
import type { TableData } from "./Room";
import { useCreateBookingMutation, useGetTableTimeslotsQuery } from "../state/api";

interface BookingFormProps {
    selectedTable: TableData;
}

interface Timeslot {
    startTime: string;
    endTime: string;
}

export function BookingForm({selectedTable} : BookingFormProps){
    const [bookingDate, setBookingDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [headcount, setHeadCount] = useState<number>(2)
    const [notes, setNotes] = useState('')
    
    const {data: timeslots = []} = useGetTableTimeslotsQuery(
        {tableId: selectedTable.id, date: bookingDate},
        {skip: !bookingDate}
    )
    const [createBooking, {isLoading, isSuccess, isError}] = useCreateBookingMutation() 

    const handleBooking = async () => {
        if(!selectedTable || !selectedSlot || !bookingDate || !name || !email || !phone ){
            return;
        }
        const [startTime, endTime] = selectedSlot.split('|')

        try{
            await createBooking({
                tableId: selectedTable.id,
                date: bookingDate,
                startTime: startTime,
                endTime: endTime,
                name: name,
                email: email,
                phone: phone,
                headcount: Number(headcount),
                notes: notes
            }).unwrap();

            setBookingDate('')
            setSelectedSlot('')
            setName('')
            setEmail('')
            setPhone('')
            setHeadCount(2)
            setNotes('')
        }catch(error){
            console.error("Részletes hiba: ", error);
        }
    }

    return (
        <div>
            <h2 className="booking-title">Asztal foglalása</h2>
            <div className="detail-view">
                <div className="detail-item">
                    <strong>Kiválasztott asztal:</strong>
                    <span>{selectedTable.type === 'foosball' ? 'Csocsó' : selectedTable.type === 'snooker' ? 'Billiárd' : 'Léghoki'}</span>
                </div>      

                <div className="booking-form-container">     
                    <div>
                        <label className="form-label">Dátum: </label>
                        <input className="form-input" 
                            type="date" 
                            value={bookingDate} 
                            onChange={(e) => {setBookingDate(e.target.value); setSelectedSlot('');}}  />
                    </div>
                    {bookingDate && (
                        <div>
                            <label className="form-label">Szabad időpontok erre a napra:</label>
                            {timeslots.length === 0 ? (
                                <p style={{ fontSize: '0.85rem', color: '#ff4444', margin: '5px 0' }}>Sajnos erre a napra már nincs szabad időpont</p>
                            ) : (
                                <select className="form-input"
                                    style={{width: '100%'}}
                                    value={selectedSlot}
                                    onChange={(e) => setSelectedSlot(e.target.value)}    
                                >
                                    <option value="" disabled>Válassz időpontot</option>
                                    {timeslots.map((slot: Timeslot, index: number) => (
                                        <option key={index} value={`${slot.startTime}|${slot.endTime}`}>{slot.startTime} - {slot.endTime}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    <hr className="form-divider" />

                    <div>
                        <label className="form-label">Név:</label>
                        <input type="text" className="form-input"
                            value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div>
                        <label className="form-label">Email:</label>
                        <input type="email" className="form-input"
                            value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="form-row">
                        <div className="form-col">
                            <label className="form-label">Tetlefon:</label>
                            <input type="text" className="form-input"
                                value={phone} onChange={(e) => setPhone(e.target.value)}/>
                        </div>
                        <div className="form-col">
                            <label className="form-label">Létszám:</label>
                            <input type="number" className="form-input"
                                value={headcount} onChange={(e) => setHeadCount(Number(e.target.value))}/>
                        </div>                        
                    </div>

                    <div>
                        <label className="form-label">Megjegyzés:</label>
                        <textarea className="form-input textarea-vertical"
                            value={notes} onChange={(e) => setNotes(e.target.value)}/>   
                    </div>
                </div>      

                {isError && <p className="msg-error"> Sikertelen foglalás </p>}
                {isSuccess && <p className="msg-success"> Sikeres foglalás </p>}      

                <button className="panel-btn btn-add btn-booking"
                    onClick={handleBooking} disabled={isLoading}>
                    Foglalás
                </button>
            </div>
        </div>
    )

}