import { Helmet } from "react-helmet";
import { Footer } from "@/components/Footer";
import { CompanySearch } from "@/components/company/CompanySearch";

const UmzugsfirmenPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Umzugsfirmen Schweiz - Vergleichen & Offerten | Umzugscheck.ch</title>
        <meta name="description" content="Finden Sie die besten Umzugsfirmen in der Schweiz. Vergleichen Sie Preise, Bewertungen und Services. Kostenlos Offerten erhalten." />
      </Helmet>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Umzugsfirmen in der Schweiz
            </h1>
            <p className="text-lg text-muted-foreground">
              Vergleichen Sie geprüfte Umzugsfirmen und finden Sie den perfekten Partner für Ihren Umzug.
            </p>
          </div>

          <CompanySearch />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UmzugsfirmenPage;
