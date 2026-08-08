// Helper functions to export content as Word (.doc) and PDF files

export function exportToWordDoc(filename: string, title: string, markdownOrHtmlText: string) {
  // Convert Markdown-like text to styled HTML for Word document compatibility
  const formattedHtml = markdownOrHtmlText
    .replace(/^# (.*$)/gim, '<h1 style="color: #1e3a8a; font-family: Arial, sans-serif; font-size: 22pt; margin-top: 18pt; border-bottom: 2px solid #3b82f6; padding-bottom: 6pt;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #1e40af; font-family: Arial, sans-serif; font-size: 16pt; margin-top: 14pt; border-bottom: 1px solid #cbd5e1; padding-bottom: 4pt;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #334155; font-family: Arial, sans-serif; font-size: 13pt; margin-top: 10pt;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^\> (.*$)/gim, '<blockquote style="background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 8px 12px; margin: 8px 0; font-style: italic;">$1</blockquote>')
    .replace(/\n/g, '<br/>');

  const fullWordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; margin: 40px; color: #0f172a; line-height: 1.6; }
        table { border-collapse: collapse; width: 100%; margin: 16px 0; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 10pt; }
        th { background-color: #f8fafc; font-weight: bold; color: #1e293b; }
        .invoice-header { background: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px; }
      </style>
    </head>
    <body>
      ${formattedHtml}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', fullWordHtml], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPdf(filename: string, title: string, contentText: string) {
  // Create a printable popup window for clean PDF printing
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Please allow popups to export PDF documents.');
    return;
  }

  const formattedHtml = contentText
    .replace(/^# (.*$)/gim, '<h1 style="color: #1e3a8a; font-size: 22px; margin-top: 16px; border-bottom: 2px solid #3b82f6; pb: 6px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #1e40af; font-size: 16px; margin-top: 14px; border-bottom: 1px solid #e2e8f0; pb: 4px;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="color: #334155; font-size: 14px; margin-top: 10px;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; font-size: 13px; }
        @media print {
          body { padding: 20px; }
          @page { margin: 15mm; }
        }
      </style>
    </head>
    <body>
      ${formattedHtml}
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
