import type { TableData } from "./Room";
import { TableForm } from "./TableForm";
import { BookingForm } from "./BookingForm";

interface SidePanelProps{
    selectedTable: TableData | undefined;
    onAddTable: (newTable: TableData) => void;
    onDeleteTable: (id: number) => void;
    onUpdateStatus: (id: number, status: number) => void;
    onToggleLock: (id:number) => void;
    onUpdateColor: (id: number, color: string) => void;
    userRole?: string;
}

export function SidePanel({selectedTable, onAddTable, onDeleteTable, onUpdateStatus, onToggleLock, onUpdateColor, userRole}: SidePanelProps){

    if(userRole === 'user'){
        return(
        <div>
            {!selectedTable ? (
                <div style={{textAlign: 'center', marginTop: '20px'}}>
                    <h2 style={{color: 'var(--text)'}}>Foglalás</h2>
                    <p style={{color: 'var(--text-h)'}}>Kattints egy asztalra a foglaláshoz</p>
                </div>
            ) : (
                <BookingForm selectedTable={selectedTable} />
            )}
        </div>
        )
    }
    return (
        <div className="side-panel">
            {!selectedTable ? (
                <TableForm onAdd={onAddTable} />
            ) : (
                <div>
                    <h2 style={{ marginTop: 0, borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>Részletes nézet</h2>
                    <div className="detail-view">
                        <div className="detail-item">
                            <strong>Típus:</strong> <span>{selectedTable.type}</span> 
                        </div>
                        <div className="detail-item">
                            <strong>Kategória:</strong> <span>{selectedTable.category}</span> 
                        </div>
                        <div className="detail-item">
                            <strong>Szín:</strong> 
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>                           
                                <select 
                                    className="form-input"
                                    value={selectedTable.color}
                                    onChange={(e) => onUpdateColor(selectedTable.id, e.target.value)}
                                    disabled={selectedTable.isLocked} 
                                >
                                    <option value="red">Piros</option>
                                    <option value="green">Zöld</option>
                                    <option value="blue">Kék</option>
                                    <option value="yellow">Sárga</option>
                                    <option value="purple">Lila</option>
                                </select>
                            </div>
                        </div>
                        <div className="detail-item">
                            <strong>Pozíció:</strong> <span>X: {selectedTable.position.x} | Y: {selectedTable.position.y}</span>
                        </div>

                        <div className="status-slider-container">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <strong>Állapot:</strong>
                                <span>{selectedTable.status} / 10</span>
                            </div>
                            <input type="range" min={1} max={10} value={selectedTable.status}
                                onChange={(e) => onUpdateStatus(selectedTable.id, Number(e.target.value))} 
                                style={{ width: '100%', cursor: 'pointer' }}/>
                        </div>
                           
                        <div className="action-buttons">
                            <button onClick={() => onToggleLock(selectedTable.id)}
                                className={`panel-btn ${selectedTable.isLocked ? 'btn-unlock' : 'btn-lock'}`}
                            > 
                                {selectedTable.isLocked ? 'Feloldás' : 'Zárolás'}
                            </button>
                            <button className="panel-btn btn-delete"
                                onClick={() => onDeleteTable(selectedTable.id)}>
                                Asztal törlése
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}