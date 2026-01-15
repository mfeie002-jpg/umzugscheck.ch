import apartment25 from "@/assets/apartment-2-5-room.jpg";

const ImageDownload = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
      <h1 className="text-2xl font-bold mb-6">2-2.5 Zimmer Wohnung Bild</h1>
      <img 
        src={apartment25} 
        alt="2-2.5 Zimmer Wohnung" 
        className="max-w-2xl w-full rounded-lg shadow-lg mb-4"
      />
      <a 
        href={apartment25} 
        download="apartment-2-5-room.jpg"
        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90"
      >
        Bild herunterladen
      </a>
    </div>
  );
};

export default ImageDownload;
