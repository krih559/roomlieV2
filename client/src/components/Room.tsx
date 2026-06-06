import { useRef } from 'react';
import {Table} from './Table';
import { checkCollision } from './tableUtils';

export interface TableData {
  id: number;
  type: string;
  category: string;
  color: string;
  status: number;
  position: { x: number; y: number };
  isLocked: boolean;
}

interface RoomProps {
    tables: TableData[];
    selectedTableId: number | null;
    onSelectTable: (id: number) => void;
    roomSize: {width: number, height: number};
    onUpdatePosition: (id: number, x: number, y: number) => void;
    userRole?: string;
}

export function Room({tables, selectedTableId, onSelectTable, roomSize, onUpdatePosition, userRole} : RoomProps){
    const roomRef = useRef<HTMLDivElement>(null);

    return(
        <div className='room-canvas'
            ref={roomRef}
            style={{ width: `${roomSize.width}px`, height: `${roomSize.height}px` }}
        >
            {tables.map((table) => (
                <Table 
                    key={table.id} 
                    data={table}
                    isSelected={table.id === selectedTableId}
                    isColliding={checkCollision(table, tables, roomSize)}
                    onSelect={onSelectTable}
                    onUpdatePosition={onUpdatePosition}
                    isDraggable={userRole === 'admin'}
                />
            ))}
        </div>
    )
}