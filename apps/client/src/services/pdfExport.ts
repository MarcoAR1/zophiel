import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportPainReportPDF(
  reportElement: HTMLElement,
  userName: string,
  period: number,
) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // ── Header ──
  pdf.setFillColor(30, 27, 75);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.text('🩺 Informe de Dolor — Zophiel', margin, 20);
  pdf.setFontSize(10);
  pdf.text(`Paciente: ${userName}`, margin, 30);
  pdf.text(`Período: últimos ${period} días`, margin, 35);
  pdf.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, pageWidth - margin - 50, 35);

  // ── Capture content as image ──
  const canvas = await html2canvas(reportElement, {
    backgroundColor: '#0d0b1a',
    scale: 2,
    logging: false,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let yPos = 45;
  let remainingHeight = imgHeight;
  let sourceY = 0;

  // First page
  const firstPageAvailable = pageHeight - yPos - margin;
  const firstChunkHeight = Math.min(remainingHeight, firstPageAvailable);
  const firstChunkSourceHeight = (firstChunkHeight / imgHeight) * canvas.height;

  // Create temp canvas for first chunk
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = firstChunkSourceHeight;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.drawImage(canvas, 0, 0, canvas.width, firstChunkSourceHeight, 0, 0, canvas.width, firstChunkSourceHeight);
  pdf.addImage(tempCanvas.toDataURL('image/png'), 'PNG', margin, yPos, imgWidth, firstChunkHeight);

  remainingHeight -= firstChunkHeight;
  sourceY += firstChunkSourceHeight;

  // Additional pages if needed
  while (remainingHeight > 5) {
    pdf.addPage();
    const chunkHeight = Math.min(remainingHeight, pageHeight - margin * 2);
    const chunkSourceHeight = (chunkHeight / imgHeight) * canvas.height;

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = chunkSourceHeight;
    const pageCtx = pageCanvas.getContext('2d')!;
    pageCtx.drawImage(canvas, 0, sourceY, canvas.width, chunkSourceHeight, 0, 0, canvas.width, chunkSourceHeight);
    pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, margin, imgWidth, chunkHeight);

    remainingHeight -= chunkHeight;
    sourceY += chunkSourceHeight;
  }

  // ── Footer on last page ──
  const lastPage = pdf.getNumberOfPages();
  pdf.setPage(lastPage);
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 170);
  pdf.text('Este informe fue generado automáticamente por Zophiel. No reemplaza el criterio médico profesional.', margin, pageHeight - 8);

  pdf.save(`informe-dolor-${period}d-${new Date().toISOString().slice(0, 10)}.pdf`);
}
