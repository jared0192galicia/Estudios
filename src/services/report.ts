import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Handlebars from 'handlebars';

export async function exportToPDF(selectedItems: any[]) {
  // 1. Cargar plantilla
  const response = await fetch('/templates/template.hbs');
  const templateText = await response.text();
  const template = Handlebars.compile(templateText);

  for (const item of selectedItems) {
    // 2. Generar HTML con estilos embebidos
    const styles = `
      <style>
        body {
          font-family: sans-serif;
          font-size: 12px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1em;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f2f2f2;
        }
      </style>
    `;
    const html = `${styles}<div>${template(item)}</div>`;

    // 3. Crear nodo temporal en el DOM
    const container = document.createElement('div');
    container.innerHTML = html;

    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '800px',
      backgroundColor: 'white',
      padding: '20px',
      zIndex: '9999',
      visibility: 'visible',
    });
    container.style.border = '2px solid red';
    console.log('Altura del nodo:', container.offsetHeight);
    

    document.body.appendChild(container);

    // ⚠️ Forzar reflow + esperar a que se pinte el DOM
    await new Promise((res) => setTimeout(res, 300)); // da tiempo a renderizar

    // 4. Convertir a imagen y PDF
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`reporte_${item.nombre ?? 'persona'}.pdf`);

    // 5. Limpiar el DOM
    document.body.removeChild(container);
  }
}
