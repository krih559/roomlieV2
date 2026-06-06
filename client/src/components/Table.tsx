import { useRef } from 'react';
import '../App.css';
import type { TableData } from './Room';
import Draggable from 'react-draggable';
import { getTableDimensions, getTableName } from './tableUtils';

interface TableProps {
    data: TableData;
    isSelected: boolean;
    isColliding: boolean;
    onSelect: (id: number) => void;
    onUpdatePosition: (id:number, x:number, y:number) => void;
    isDraggable: boolean;
}


export function Table({data, isSelected, isColliding, onSelect, onUpdatePosition, isDraggable}: TableProps){
    const nodeRef = useRef<HTMLDivElement>(null);
    const selectedClass = isSelected ? "selected" : "unselected";
    const categoryClass = `category-${data.category}`;
    const collisionClass = isColliding ? "collision-error" : "";
    const lockedClass = data.isLocked ? "locked" : ""
    const dimensions = getTableDimensions(data.type);

    return(
        <Draggable
            nodeRef={nodeRef}
            disabled={data.isLocked || !isDraggable}
            position={{x: data.position.x, y: data.position.y}}
            bounds="parent"
            onStart={() => onSelect(data.id)}
            onStop={(_e, dataObj) => {
                onUpdatePosition(data.id, dataObj.x, dataObj.y);
            }}
        >
            <div className={`roomlie-table ${selectedClass} ${categoryClass} ${collisionClass} ${lockedClass}`}
                style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    backgroundColor: data.color,
                    opacity: data.status / 10,
                }}
                
                ref={nodeRef}
                onClick={(e) =>{
                    e.stopPropagation();
                    onSelect(data.id);
                }} 
            >
                {getTableName(data.type)}
            </div>
        </Draggable>
    );
}