const ImageDownload = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <h1 className="text-2xl font-bold mb-6">Umzugscheck.ch Logo für WhatsApp</h1>
      
      {/* Logo als SVG für Download */}
      <div className="bg-primary p-8 rounded-2xl mb-6">
        <svg 
          viewBox="0 0 200 200" 
          className="w-48 h-48"
          id="whatsapp-logo"
        >
          {/* Background Circle */}
          <circle cx="100" cy="100" r="90" fill="#0050A8" />
          
          {/* House body */}
          <g transform="translate(50, 55)">
            <path 
              d="M50 25L10 55V95H90V55L50 25Z" 
              fill="#ffffff"
            />
            {/* Roof */}
            <path 
              d="M0 58L50 15L100 58" 
              fill="none" 
              stroke="#dc2626" 
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Checkmark */}
            <path 
              d="M25 60L42 77L75 38" 
              fill="none" 
              stroke="#0050A8"
              strokeWidth="8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      <p className="text-muted-foreground mb-4">Rechtsklick → "Bild speichern unter" oder Screenshot machen</p>

      {/* Alternative: Reines Icon ohne Hintergrund */}
      <h2 className="text-lg font-semibold mt-8 mb-4">Variante 2: Quadratisch</h2>
      <div className="bg-primary rounded-2xl p-6 mb-6">
        <svg 
          viewBox="0 0 120 120" 
          className="w-40 h-40"
        >
          <rect x="0" y="0" width="120" height="120" rx="20" fill="#0050A8" />
          
          <g transform="translate(20, 25)">
            {/* House body */}
            <path 
              d="M40 18L8 42V74H72V42L40 18Z" 
              fill="#ffffff"
            />
            {/* Roof */}
            <path 
              d="M0 45L40 10L80 45" 
              fill="none" 
              stroke="#dc2626" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            {/* Checkmark */}
            <path 
              d="M20 48L33 61L60 30" 
              fill="none" 
              stroke="#0050A8"
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      <p className="text-sm text-muted-foreground">Tipp: Screenshot machen für WhatsApp Business Profilbild</p>
    </div>
  );
};

export default ImageDownload;