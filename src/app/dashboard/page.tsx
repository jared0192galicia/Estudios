'use client';

import { useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function DashboardPage() {
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [filters, setFilters] = useState({});
  const [data, setData] = useState(
    Array.from({ length: 50 }).map((_, i) => ({
      id: i + 1,
      name: `Nombre ${i + 1}`,
      email: `email${i + 1}@unsis.edu.mx`,
      carrera: 'Enfermería',
      semestre: Math.floor(Math.random() * 8) + 1,
      promedio: (Math.random() * 10).toFixed(2),
      fechaRegistro: new Date().toLocaleDateString(),
      estado: i % 2 === 0 ? 'Activo' : 'Inactivo',
      genero: i % 2 === 0 ? 'Femenino' : 'Masculino',
      curp: `CURP${i + 1}`,
      matricula: `UNSIS${1000 + i}`,
    }))
  );

  const handleExportPDF = () => {
    alert(`Exportando ${selectedItems.length} registro(s) a PDF...`);
    // Lógica real de exportación a PDF va aquí
  };

  const handleExcelUpload = () =>
    alert('Función de carga de Excel no implementada.');
  const handleExcelDownload = () =>
    alert('Función de descarga de Excel no implementada.');
  const handleLogout = () => alert('Cerrar sesión');

  const toolbarLeft = (
    <div className="flex gap-2">
      <Button
        label="Cerrar sesión"
        icon="pi pi-sign-out"
        className="p-button-danger"
        onClick={handleLogout}
      />
    </div>
  );

  const toolbarRight = (
    <div className="flex gap-2 bg-unsis-olive p-2 rounded">
      <Button
        label="Cargar Excel"
        icon="pi pi-upload"
        onClick={handleExcelUpload}
      />
      <Button
        label="Descargar Excel"
        icon="pi pi-download"
        onClick={handleExcelDownload}
      />
      <Button
        label="Exportar PDF"
        icon="pi pi-file-pdf"
        className="p-button-warning"
        onClick={handleExportPDF}
        disabled={selectedItems.length === 0}
      />
    </div>
  );

  const columns = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Nombre' },
    { field: 'email', header: 'Email' },
    { field: 'carrera', header: 'Carrera' },
    { field: 'semestre', header: 'Semestre' },
    { field: 'promedio', header: 'Promedio' },
    { field: 'fechaRegistro', header: 'Registro' },
    { field: 'estado', header: 'Estado' },
    { field: 'genero', header: 'Género' },
    { field: 'curp', header: 'CURP' },
    { field: 'matricula', header: 'Matrícula' },
  ];

  return (
    <div className="p-4 bg-unsis-black min-h-screen">
      <Toolbar className="mb-4" start={toolbarLeft} end={toolbarRight} />

      <div className="card">
        <DataTable
          value={data}
          selection={selectedItems}
          onSelectionChange={(e) => setSelectedItems(e.value)}
          paginator
          rows={10}
          dataKey="id"
          filters={filters}
          filterDisplay="row"
          showGridlines
          responsiveLayout="scroll"
          selectionMode="checkbox"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: '3rem' }}
          ></Column>
          {columns.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              filter
              filterPlaceholder={`Buscar ${col.header.toLowerCase()}`}
              style={{ minWidth: '150px' }}
            />
          ))}
        </DataTable>
      </div>
    </div>
  );
}
