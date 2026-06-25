package br.com.app.quero_pecas.controller;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {

    @PostMapping("/gerar")
    public ResponseEntity<byte[]> gerarPdfOrcamento(@RequestBody String htmlConteudo) {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {

            // Monta o documento XHTML injetando alguns estilos básicos necessários para
            // compensar a falta do CSS global (como bordas de tabelas e grids primitivos)
            String htmlFinal = "<!DOCTYPE html><html><head><meta charset='UTF-8'/>"
                    + "<style>"
                    + "body { font-family: Arial, sans-serif; color: #333; margin: 20px; }"
                    + ".doc-section { margin-bottom: 25px; border-bottom: 1px solid #ddd; padding-bottom: 15px; }"
                    + ".section-title { color: #0056b3; font-size: 18px; margin-bottom: 10px; }"
                    + ".field-label { font-size: 11px; color: #777; margin: 0 0 3px 0; text-transform: uppercase; }"
                    + ".field-value, .field-value-pdf { font-size: 14px; font-weight: bold; margin: 0 0 10px 0; }"
                    + "table { width: 100%; border-collapse: collapse; margin-top: 10px; }"
                    + "table, th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }"
                    + ".totalizadores-container { margin-top: 20px; text-align: right; float: right; width: 300px; }"
                    + ".total-row { margin-bottom: 5px; font-size: 14px; }"
                    + ".total-geral { font-size: 18px; font-weight: bold; color: #d9534f; margin-top: 10px; }"
                    + "</style></head><body>"
                    + "<div class='orcamento-pdf-container'>"
                    + htmlConteudo
                    + "</div>"
                    + "</body></html>";

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(htmlFinal, null);
            builder.toStream(os);
            builder.run();

            byte[] pdfBytes = os.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            // Define o nome do arquivo baixado
            headers.setContentDispositionFormData("attachment", "orcamento.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
