import { savePDF } from '@progress/kendo-react-pdf';

class DocService {
  createPdf = (html) => {
    savePDF(html, { 
      paperSize: 'A4',
      fileName: 'form.pdf',
    })
  }
}

const Doc = new DocService();
export default Doc;