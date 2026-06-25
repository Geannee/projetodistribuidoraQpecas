async function gerarOrcamentoPDF() {
    const elemento = document.querySelector('.orcamento-pdf-container');

    const botoes = elemento.querySelector('.actions-area');
    if (botoes) botoes.style.display = 'none';

    const nome_cliente = document.getElementById('nomeCliente').value || 'Cliente';
    const data_orcamento = document.getElementById('pdfDataEmissao').value || Date.now();

    try {
        const canvas = await html2canvas(elemento, {
            scale: 1.5,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        if (botoes) botoes.style.display = 'flex';

        const imgData = canvas.toDataURL('image/jpeg', 0.75);

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'l',
            unit: 'mm',
            format: 'a4',
            compress: true
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;
        }

        pdf.save(`orcamento_${nome_cliente+"_"+data_orcamento}.pdf`);

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        alert('Ocorreu um erro ao gerar o PDF.');
        if (botoes) botoes.style.display = 'flex';
    }
}