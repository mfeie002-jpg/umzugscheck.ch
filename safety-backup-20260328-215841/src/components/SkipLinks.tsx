const SkipLinks = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-0 left-0 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        Zum Hauptinhalt springen
      </a>
      <a
        href="#navigation"
        className="fixed top-0 left-32 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        Zur Navigation springen
      </a>
      <a
        href="#footer"
        className="fixed top-0 left-64 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-br-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform"
      >
        Zum Footer springen
      </a>
    </div>
  );
};

export default SkipLinks;
