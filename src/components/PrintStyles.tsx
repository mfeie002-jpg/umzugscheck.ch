import { useEffect } from 'react';

export function PrintStyles() {
  useEffect(() => {
    // Add print-specific styles dynamically
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = `
      @media print {
        /* Hide non-essential elements */
        header,
        footer,
        nav,
        .no-print,
        .cookie-consent,
        .chat-widget,
        .back-to-top,
        .mobile-bottom-nav,
        .sticky-cta,
        button:not(.print-include),
        [role="dialog"],
        [role="alertdialog"] {
          display: none !important;
        }

        /* Reset backgrounds and colors for printing */
        body {
          background: white !important;
          color: black !important;
          font-size: 12pt;
          line-height: 1.5;
        }

        /* Ensure content is visible */
        .print-content,
        main {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
        }

        /* Handle page breaks */
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
          page-break-inside: avoid;
        }

        img, table, figure {
          page-break-inside: avoid;
        }

        /* Show URLs for links */
        a[href^="http"]:after {
          content: " (" attr(href) ")";
          font-size: 0.8em;
          color: #666;
        }

        a[href^="/"]:after {
          content: " (feierabend-umzuege.ch" attr(href) ")";
          font-size: 0.8em;
          color: #666;
        }

        /* Optimize tables */
        table {
          border-collapse: collapse;
          width: 100%;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        /* Cards print nicely */
        .card {
          border: 1px solid #ddd;
          margin-bottom: 1rem;
          page-break-inside: avoid;
        }

        /* Print margins */
        @page {
          margin: 2cm;
        }

        /* First page header */
        @page :first {
          margin-top: 3cm;
        }
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('print-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return null;
}

export default PrintStyles;
