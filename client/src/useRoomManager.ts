import { useState } from "react";
import type { TableData } from "./components/Room";
import { useCreateTableMutation, useDeleteTableMutation, useUpdateTableMutation, useUpdateTablePositionMutation } from "./state/api";

export function useRoomManager(initialTables: TableData[]){
  const [tables, setTables] = useState<TableData[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [roomSize, setRoomSize] = useState({ width: 800, height: 600 });

  const [updateTablePosition] = useUpdateTablePositionMutation();
  const [createTable] = useCreateTableMutation();
  const [updateTable] = useUpdateTableMutation();
  const [deleteTable] = useDeleteTableMutation();

  const selectedTable = tables.find(t => t.id === selectedTableId);

  const initializeTables = (serverTables: TableData[]) => {
    setTables(serverTables);
  };

  const handleAddTable = async (newTable: TableData) => {
    try {
      const backendPayload = {
        name: `${newTable.type} asztal`,
        type: newTable.type,
        category: newTable.category,
        color: newTable.color,
        status: newTable.status,
        position: { x: newTable.position.x, y: newTable.position.y }, // <-- ITT A LÉNYEG
        isLocked: newTable.isLocked
      };

      await createTable(backendPayload).unwrap();
    } catch (error: unknown) { 
      console.error("Részletes hiba asztal hozzáadásakor: ", error);
      const err = error as { data?: unknown };
      alert("SZERVER HIBA AZ ASZTAL LETÉTELEKOR!\n\n" + JSON.stringify(err?.data || error, null, 2));
    }
  };

  const handleDeleteTable = async (idToDelete: number) => {
    try{
      await deleteTable(idToDelete).unwrap()
      setSelectedTableId(null)
    } catch(error){
      console.error("Hiba az asztal törlésekor: ", error)
    }
  }

  const handleRoomSizeChange = (newWidth: number, newHeight: number) => {
    setRoomSize({ width: newWidth, height: newHeight });
    setTables([]);
    setSelectedTableId(null);
  }

  const handleUpdatePosition = async (id: number, newX: number, newY: number) => {
    const tableToMove = tables.find(t => t.id === id);
    if(!tableToMove) return;

    const proposedTable = {...tableToMove, position: {x: newX, y:newY} };

    setTables(tables.map(table => 
      table.id === id ? proposedTable : table
    ));

    try{
      await updateTablePosition({id, x: newX, y:newY}).unwrap()
    } catch(error){
      console.error("Hiba az asztal mentésekor: ", error)
    }

  };

  const handleUpdateStatus = async (id: number, newStatus: number) => {
    setTables(tables.map(table => 
      table.id === id ? {...table, status: newStatus} : table
    ));
    try{
      await updateTable({id, status: newStatus}).unwrap()
    } catch(error){
      console.error("Hiba a státusz mentésekor ", error)
    }
  };

  const handleToggleLock = async (id: number) => {
    const table = tables.find(t => t.id === id)
    if(!table) return
    const newLockState = !table.isLocked
    setTables(tables.map(t => t.id === id ? {...t, isLocked : newLockState} : t))

    try{
      await updateTable({id, isLocked: newLockState}).unwrap()
    } catch(error){
      console.error("Hiba a zárolás mentésekor ", error)
    }
  };

  const getAverageStatus = (type: string) => {
    const filtered = tables.filter(t => t.type === type);
    if(filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, curr) => acc + curr.status, 0);
    return (sum / filtered.length).toFixed(1);
  };

  const handleUpdateColor = async (id: number, newColor: string) => {
    setTables(tables.map(table => 
      table.id === id ? {...table, color: newColor} : table
    ));
    try{
      await updateTable({id, color:newColor}).unwrap()
    } catch(error) {
      console.error("Hiba a szín mentésekor " + error )
    }
  };

  return {
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
  };
}