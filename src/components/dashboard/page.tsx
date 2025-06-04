'use client';

import { useEffect, useRef, useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Cookies from 'js-cookie';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { AxiosResponse } from 'axios';
import api from '@/services/axios';
import { useRouter } from 'next/navigation';
import { exportToPDF } from '@/services/report';
import { InputSwitch } from 'primereact/inputswitch';

type Loaders = {
  table: boolean;
  excel: boolean;
  pdf: boolean;
};

export default function DashboardPage() {
  const [selectedItems, setSelectedItems] = useState<any>([]);
  const [data, setData] = useState([{}]);
  const [pdfMode, setPdfMode] = useState(false);
  const [loaders, setLoaders] = useState<Loaders>({
    table: true,
    excel: false,
    pdf: false,
  });
  const toast = useRef(null);
  const router = useRouter();
  const fileUploadRef = useRef<FileUpload | null>(null);


  useEffect(() => {
    fetchData();
  }, []);

  const changeLoader = (key: keyof Loaders, value: boolean) =>
    setLoaders((prev) => ({ ...prev, [key]: value }));

  const handleExcelUpload = async (e: any) => {
    const formData = new FormData();
    formData.append('file', e.files[0]);
    try {
      changeLoader('excel', true);
      await api.post('/dashboard/upload-excel', formData);
      onUpload();
    } catch (error) {
      console.log('Catch Error: ', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Algo salió mal al cargar los datos',
        life: 3000,
      });
    } finally {
      changeLoader('excel', false);
    }
  };

  const fetchData = async () => {
    try {
      changeLoader('table', true);
      const response: AxiosResponse = await api.get('/dashboard/data');
      setData(response.data);
    } catch (error) {
      console.log('Catch Error: ', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Algo salió mal al cargar los datos',
        life: 3000,
      });
    } finally {
      changeLoader('table', false);
      fileUploadRef.current?.clear(); 
    }
  };
  const handleLogout = () => {
    // logout functionallity, remove cookies and redirect to login page
    Cookies.remove('unsisToken');
    router.push('/entrar');
  };

  const onUpload = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Completado',
      detail: 'Archivo subido correctamente',
      life: 3000,
    });
    fetchData();
  };

  const toolbarEnd = (
    <div className="flex gap-2 items-left">
      <Button
        label="Cerrar sesión"
        icon="pi pi-sign-out"
        className="p-button-danger"
        onClick={handleLogout}
      />
    </div>
  );

  const toolbarStart = (
    <div className="flex gap-2 bg-unsis-olive p-2 rounded flex-wrap items-center">
      <FileUpload
        mode="basic"
        accept=".xlsx, .ods"
        maxFileSize={1000000}
        uploadHandler={handleExcelUpload}
        customUpload
        auto
        ref={fileUploadRef}
        chooseLabel="Subir Excel"
      />
      <Button
        label="Exportar PDF"
        icon="pi pi-file-pdf"
        className="p-button-warning"
        loading={loaders.pdf}
        onClick={async () => {
          changeLoader('pdf', true);
          await exportToPDF(selectedItems, pdfMode);
          changeLoader('pdf', false);
        }}
        disabled={selectedItems.length === 0}
      />

      <div className="card flex justify-content-center flex-col items-center gap-2 w-52">
        <label className="mr-2">
          {/* Descargar {pdfMode ? 'Separado'} */}
          Descargar por separado
        </label>
        <InputSwitch checked={pdfMode} onChange={(e) => setPdfMode(e.value)} />
      </div>
    </div>
  );

  const columns = [
    { field: 'matricula', header: 'Matricula' },
    { field: 'apPaterno', header: 'Apellido Paterno' },
    { field: 'apMaterno', header: 'Apellido Materno' },
    { field: 'nombres', header: 'Nombres' },
    { field: 'edad', header: 'Edad' },
    { field: 'sexo', header: 'Sexo' },
    { field: 'fecha', header: 'Fecha' },
    { field: 'cocaina', header: 'Cocaina' },
    { field: 'anfetamina', header: 'Anfetamina' },
    { field: 'metanfetamina', header: 'Metanfetamina' },
    { field: 'opioides', header: 'Opioides' },
    { field: 'cannabis', header: 'Cannabis' },
  ];

  return (
    <div className="p-4 bg-unsis-black min-h-screen">
      <Toast ref={toast}></Toast>
      <Toolbar className="mb-4" start={toolbarStart} end={toolbarEnd} />

      {/* <div className="h-full overflow-auto"> */}
      <DataTable
        loading={loaders.table}
        size="small"
        value={data}
        selection={selectedItems}
        onSelectionChange={(e) => setSelectedItems(e.value)}
        rows={10}
        dataKey="id"
        scrollHeight="600px"
        virtualScrollerOptions={{ itemSize: 46 }}
        emptyMessage="Sin resultados"
        scrollable
        filterDisplay="row"
        showGridlines
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
            showFilterMenu={false}
            header={col.header}
            filter
            filterMatchMode="contains"
            filterPlaceholder={`Buscar ${col.header.toLowerCase()}`}
            style={{ minWidth: '150px' }}
          />
        ))}
      </DataTable>
    </div>
    // </div>
  );
}
