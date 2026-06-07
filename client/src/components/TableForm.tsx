import { useState } from "react";
import type { TableData } from "./Room";

interface TableFormProps {
    onAdd: (newTable: TableData) => void;
}

export function TableForm({onAdd}: TableFormProps){
    const [type, setType] = useState('foosball');
    const [category, setCategory] = useState('normal');
    const [color, setColor] = useState('blue');
    const [status, setStatus] = useState<number>(10);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTable = {
            id: Date.now(),
            type: type,
            category: category,
            color: color,
            status: status,
            position: {x: 50, y: 50},
            isLocked: false
        };

        onAdd(newTable as TableData); // <-- Típus kényszerítés a Vercel kedvéért

        setType('foosball');
        setCategory('normal');
        setColor('blue'); // <-- Szín visszaállítása alaphelyzetbe
        setStatus(10);
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Új asztal</h2> {/* <-- Kivettük a fix fekete színt! */}

            <div className="detail-view">
                <div className="detail-item">
                    <strong>Típus:</strong>
                    <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="foosball">Csocsó</option>
                        <option value="snooker">Billiárd</option>
                        <option value="air-hockey">Léghoki</option>
                    </select>
                </div>
            </div>

            <div className="detail-view">
                <div className="detail-item">
                    <strong>Kategória:</strong>
                    <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="normal">Normál</option>
                        <option value="competition">Verseny</option>
                        <option value="kids">Gyerek</option>
                    </select>
                </div>
            </div>

            <div className="detail-view">
                <div className="detail-item">
                    <strong>Szín:</strong>
                    <select className="form-input" value={color} onChange={(e) => setColor(e.target.value)}>
                        <option value="red">Piros</option>
                        <option value="green">Zöld</option>
                        <option value="blue">Kék</option>
                        <option value="yellow">Sárga</option>
                        <option value="purple">Lila</option>
                    </select>
                </div>
            </div>

            <div className="status-slider-container">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>Állapot</strong>
                    <span>{status} / 10</span>
                </div>
                <input type="range" min={1} max={10} value={status} 
                    onChange={(e) => setStatus(Number(e.target.value))} 
                    style={{ width: '100%', cursor: 'pointer' }} />
            </div>

            <div className="action-buttons">
                <button type="submit" className="panel-btn btn-add" >
                    Asztal elhelyezése
                </button>
            </div>
        </form>
    )
}