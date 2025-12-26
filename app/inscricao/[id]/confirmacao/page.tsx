<style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          * {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .comprovante-print, .comprovante-print * {
            visibility: visible;
          }
          
          .comprovante-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 148.5mm !important;
            max-height: 148.5mm !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            background: white !important;
            overflow: hidden !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          /* Cabeçalho verde */
          .comprovante-print .bg-gradient-to-r {
            padding: 6mm 10mm !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
          }
          
          .comprovante-print .inline-flex {
            width: 32pt !important;
            height: 32pt !important;
            margin-bottom: 4pt !important;
          }
          
          .comprovante-print .inline-flex svg {
            width: 20pt !important;
            height: 20pt !important;
          }
          
          .comprovante-print h1 {
            font-size: 16pt !important;
            margin-bottom: 4pt !important;
            line-height: 1.2 !important;
          }
          
          .comprovante-print .bg-gradient-to-r p {
            font-size: 8pt !important;
            margin: 0 !important;
            line-height: 1.3 !important;
          }
          
          /* Conteúdo principal */
          .comprovante-print .px-6 {
            padding: 6mm 10mm !important;
            display: flex !important;
            flex-direction: column !important;
            flex: 1 !important;
            justify-content: space-between !important;
          }
          
          /* Box de protocolo e senha */
          .comprovante-print .bg-gradient-to-br {
            padding: 4mm !important;
            margin-bottom: 3mm !important;
          }
          
          .comprovante-print .space-y-4 > div {
            margin-bottom: 3mm !important;
          }
          
          .comprovante-print .space-y-4 > div:last-child {
            margin-bottom: 0 !important;
          }
          
          .comprovante-print .bg-white.rounded-lg {
            padding: 3mm !important;
            margin: 0 !important;
          }
          
          .comprovante-print .uppercase {
            font-size: 7pt !important;
            margin-bottom: 2pt !important;
          }
          
          .comprovante-print .text-2xl {
            font-size: 16pt !important;
            line-height: 1.2 !important;
          }
          
          .comprovante-print .text-3xl {
            font-size: 18pt !important;
            line-height: 1.2 !important;
          }
          
          /* Box amarelo de aviso */
          .comprovante-print .bg-amber-50 {
            padding: 3mm !important;
            margin-bottom: 3mm !important;
          }
          
          .comprovante-print .bg-amber-50 p {
            font-size: 7pt !important;
            margin-bottom: 2pt !important;
            line-height: 1.2 !important;
          }
          
          .comprovante-print .bg-amber-50 ul {
            font-size: 7pt !important;
            line-height: 1.3 !important;
            margin: 0 !important;
            padding-left: 4mm !important;
          }
          
          .comprovante-print .bg-amber-50 li {
            margin-bottom: 1pt !important;
          }
          
          /* Rodapé */
          .comprovante-print .text-xs {
            font-size: 7pt !important;
            line-height: 1.3 !important;
          }
          
          .comprovante-print .text-\\[10px\\] {
            font-size: 6pt !important;
          }
          
          .comprovante-print .border-t {
            padding-top: 2mm !important;
            margin-top: 0 !important;
          }
          
          .comprovante-print .space-y-2 > div {
            margin-bottom: 2mm !important;
          }
          
          .comprovante-print .space-y-2 > div:last-child {
            margin-bottom: 0 !important;
          }
          
          /* Esconder botões e elementos não imprimíveis */
          button, .no-print, a, .btn, .flex-col.sm\\:flex-row {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Linha de corte */
          .comprovante-print::after {
            content: '✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -';
            position: absolute;
            bottom: -3mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 8pt;
            color: #999;
            letter-spacing: 2px;
          }
        }
      `}</style>