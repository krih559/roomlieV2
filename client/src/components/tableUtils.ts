import type { TableData } from "./Room";

export const getTableDimensions = (type: string) => {
    switch(type){
        case 'snooker': return {width: '150px', height: '80px'};
        case 'air-hockey': return {width: '120px', height: '70px'};
        case 'foosball': return {width: '100px', height: '60px'};
        default: return {width: '100px', height: '60px'};
    }
}

export const getTableName = (type: string) => {
    switch(type){
        case 'snooker' : return 'Billiárd';
        case 'air-hockey' : return 'Léghoki';
        case 'foosball' : return 'Csocsó';
        default: return type;
    }
}

export const checkCollision = (targetTable: TableData, allTables: TableData[], roomSize: {width: number, height: number}) => {
    const dim = getTableDimensions(targetTable.type);
    const w = parseInt(dim.width);
    const h = parseInt(dim.height);

    const left = targetTable.position.x;
    const right = left + w
    const top = targetTable.position.y;
    const bottom = top + h;

    const gap = 15;

    if(left < 0 || top < 0 || right > roomSize.width || bottom > roomSize.height){
        return true;
    }

    for(const other of allTables){
        if(other.id === targetTable.id) continue;

        const otherDim = getTableDimensions(other.type);
        const oLeft = other.position.x;
        const oRight = oLeft + parseInt(otherDim.width);
        const oTop = other.position.y;
        const oBottom = oTop + parseInt(otherDim.height);

        if (
            left - gap < oRight && 
            right + gap > oLeft && 
            top - gap < oBottom && 
            bottom + gap > oTop){
                return true;
        }
    }
    return false;
}