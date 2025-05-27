import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;
let pdfMake: typeof import('pdfmake/build/pdfmake') | null = null;

async function loadPdfMake() {
  if (!pdfMake) {
    const pdfMakeModule = await import('pdfmake/build/pdfmake');
    const pdfFontsModule = await import('pdfmake/build/vfs_fonts');
    // Aquí asignamos pdfMakeModule.vfs al objeto vfs que exporta pdfFontsModule directamente
    pdfMakeModule.vfs = pdfFontsModule.vfs;
    pdfMake = pdfMakeModule;
  }
  return pdfMake;
}


export async function exportToPDF(datos: any[]) {
 const pdfMake = await loadPdfMake();
 const imageBase64 = await getBase64ImageFromURL('/Imgs_Pdf/image.png');
  datos.forEach((item) => {
    // Construimos el contenido para pdfMake
    const docDefinition = {
      pageSize: 'LETTER',
      pageMargins: [40, 60, 40, 60], // margen [izq, arriba, der, abajo]
      content: [
        {
          image: imageBase64,
          width: 150,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },
        {
          // image: imageBase64,
          text: 'Universidad de la Sierra Sur',
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            { text: 'Paciente:', bold: true, width: 'auto' },
            {
              text: `${item.nombres} ${item.apPaterno} ${item.apMaterno}`,
              width: '*',
            },
          ],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            { text: 'Edad:', bold: true, width: 'auto' },
            { text: `${item.edad}`, width: 'auto' },
            { text: 'Sexo:', bold: true, width: 'auto', margin: [20, 0, 0, 0] },
            { text: `${item.sexo}`, width: '*' },
          ],
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            { text: 'A quien corresponda', width: '80%' },
            { text: `Fecha: ${item.fecha}`, alignment: 'right', width: 'auto' },
          ],
          margin: [0, 20, 0, 20],
          fontSize: 12,
          bold: true,
          decoration: 'underline',
        },
        {
          text: 'DROGAS DE ABUSO',
          style: 'header',
          margin: [0, 10, 0, 10],
        },
        {
          table: {
            widths: ['33%', '33%', '34%'],
            body: [
              [
                { text: 'SUSTANCIAS', bold: true },
                { text: 'RESULTADOS', bold: true, alignment: 'center' },
                {
                  text: 'VALORES DE REFERENCIA',
                  bold: true,
                  alignment: 'right',
                },
              ],
              [
                'COCAÍNA',
                { text: item.cocaina || '', alignment: 'center' },
                { text: 'NEGATIVO', alignment: 'right' },
              ],
              [
                'ANFETAMINAS',
                { text: item.anfetamina || '', alignment: 'center' },
                { text: 'NEGATIVO', alignment: 'right' },
              ],
              [
                'METANFETAMINAS',
                { text: item.metanfetamina || '', alignment: 'center' },
                { text: 'NEGATIVO', alignment: 'right' },
              ],
              [
                'OPIOIDES',
                { text: item.opioides || '', alignment: 'center' },
                { text: 'NEGATIVO', alignment: 'right' },
              ],
              [
                'CANNABIS(THC)',
                { text: item.cannbis || '', alignment: 'center' },
                { text: 'NEGATIVO', alignment: 'right' },
              ],
            ],
          },
          layout: {
            fillColor: function (rowIndex: number) {
              return rowIndex === 0 ? '#CCCCCC' : null;
            },
            hLineWidth: function () {
              return 1;
            },
            vLineWidth: function () {
              return 0;
            },
            hLineColor: function () {
              return '#000000';
            },
          },
          margin: [0, 0, 0, 20],
        },
        {
          text: 'Visto Bueno',
          style: 'subheader',
          alignment: 'center',
          margin: [0, 30, 0, 10],
        },
        {
          text: [
            'Enf. Leticia Franco Rojas\n',
            'Ced. Profesional: 10874795\n',
            'Enfermera del Centro Comunitario de Salud Mental y Adicciones\n',
            'Trinidad de Viguera',
          ],
          alignment: 'center',
          fontSize: 12,
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          decoration: 'underline',
        },
        subheader: {
          fontSize: 16,
          bold: true,
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`reporte_${item.nombres || 'sin_nombre'}.pdf`);
  });
}

function getBase64ImageFromURL(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No context');

      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}
