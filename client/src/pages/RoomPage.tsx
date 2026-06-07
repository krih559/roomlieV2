import { useEffect } from 'react';
import initialTables from '../data/tables.json';
import { Room } from '../components/Room';
import { SidePanel } from '../components/SidePanel';
import { useRoomManager } from '../useRoomManager';
import { useGetTablesQuery } from '../state/api';
import { useSelector } from 'react-redux';
import type { RootState } from '../state/store';

export function RoomPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const {data: tableData, isLoading, isError} = useGetTablesQuery(undefined);
  const {
    tables,
    initializeTables,
    selectedTableId,
    setSelectedTableId,
    roomSize,
    selectedTable,
    handleAddTable,
    handleDeleteTable,
    handleRoomSizeChange,
    handleUpdatePosition,
    handleUpdateStatus,
    handleToggleLock,
    getAverageStatus,
    handleUpdateColor
    } = useRoomManager(initialTables);

  useEffect(() => {
    if(tableData){
      initializeTables(tableData);
    }
  }, [tableData]);


  if (isLoading) return <div>Asztalok betöltése...</div>;
  if (isError) return <div>Hiba történt az adatok lekérésekor</div>;

  return (
    <div className='app-container' >
      <h1>Teremkezelő</h1>

      <div className='controls-bar'>
        <strong>Terem mérete: </strong>
        <div className='size-inputs'>
          <label> Szélesség:
            <input type="number" value={roomSize.width}
              onChange={(e) => handleRoomSizeChange(Number(e.target.value), roomSize.height)} 
              />
          </label>
          <label> Magasság:
            <input type="number" value={roomSize.height}
              onChange={(e) => handleRoomSizeChange(roomSize.width, Number(e.target.value))} 
              />
          </label>
        </div>
      </div>

      <div className='layout-container'>
        <div className='canvas-wrapper' onClick={() => setSelectedTableId(null)}>
          <Room 
            tables={tables}
            selectedTableId={selectedTableId}
            onSelectTable={user ? setSelectedTableId : () => {}}
            roomSize={roomSize}
            onUpdatePosition={handleUpdatePosition}
            userRole={user?.role}
          />
        </div>

        {user && (
          <SidePanel 
            selectedTable={selectedTable} 
            onAddTable={handleAddTable} 
            onDeleteTable={handleDeleteTable} 
            onUpdateStatus={handleUpdateStatus}
            onToggleLock={handleToggleLock}
            onUpdateColor={handleUpdateColor}
            userRole={user.role}
          />
        )}
      </div>

      <div className="stats-container">
        <h3>Statisztika</h3>
        <div className='stats-grid'>
          <div className='stat-card'>
            <span className='stat-label'>Összes asztal</span>
            <span className='stat-value'>{tables.length}</span>
          </div>
          <div className='stat-card'>
            <span className='stat-label'>Csocsó átlag</span>
            <span className='stat-value'>{getAverageStatus('foosball')}</span>
          </div>
          <div className='stat-card'>
            <span className='stat-label'>Billiárd átlag</span>
            <span className='stat-value'>{getAverageStatus('snooker')}</span>
          </div>
          <div className='stat-card'>
            <span className='stat-label'>Léghoki átlag</span>
            <span className='stat-value'>{getAverageStatus('air-hockey')}</span>
          </div>
        </div>
      </div>

    </div>

  );

}