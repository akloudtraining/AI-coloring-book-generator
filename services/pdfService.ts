
// This tells TypeScript that `jspdf` will be available on the global scope from the CDN script.
declare const jspdf: any;

export const createColoringBookPdf = (coverImage: string, pageImages: string[]): void => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const usableWidth = pageWidth - (margin * 2);
  const usableHeight = pageHeight - (margin * 2);

  const addImageToPage = (imageData: string) => {
    // Assuming images are square from the API call, we fit them to the width.
    const imgWidth = usableWidth;
    const imgHeight = usableWidth; // Maintain 1:1 aspect ratio
    const x = margin;
    // Center the image vertically
    const y = (pageHeight - imgHeight) / 2;
    doc.addImage(`data:image/png;base64,${imageData}`, 'PNG', x, y, imgWidth, imgHeight);
  };
  
  // Add cover page
  addImageToPage(coverImage);

  // Add coloring pages
  pageImages.forEach(pageData => {
    doc.addPage();
    addImageToPage(pageData);
  });

  doc.save('My-AI-Coloring-Book.pdf');
};
