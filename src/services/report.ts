import { AxiosResponse } from 'axios';
import api from './axios';

export async function exportToPDF(datos: any[]) {
  try {
    const ids = datos.map((item) => item.id);
    const params = { ids: ids.join(',') };
    const response: AxiosResponse = await api.get('dashboard/file', {
      params,
      responseType: 'blob',
    });

    // Crear un enlace y descargar el archivo
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo.pdf';
    document.body.appendChild(a);
    a.click();

    // Limpiar
    window.URL.revokeObjectURL(url);
    a.remove();
  } catch (error) {
    console.log(error);
  }
}