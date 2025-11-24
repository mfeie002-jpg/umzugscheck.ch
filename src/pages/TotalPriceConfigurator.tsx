import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Sparkles, Trash2, Box, Warehouse, Wrench, Check } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  calculateQuickMovingPrice,
  calculateCleaningPrice,
  calculateStoragePrice,
  calculateDisposalPrice,
  calculatePackingPrice,
  calculateAssemblyPrice,
  formatCurrency,
  type CleaningCalculatorInput,
  type StorageCalculatorInput,
  type DisposalCalculatorInput,
  type PackingCalculatorInput,
  type AssemblyCalculatorInput,
} from "@/lib/pricing";

const services = [
  { id: "moving", label: "Umzugsservice", icon: Package, description: "Transport und Umzug" },
  { id: "cleaning", label: "Endreinigung", icon: Sparkles, description: "Professionelle Reinigung" },
  { id: "disposal", label: "Entsorgung", icon: Trash2, description: "Möbel- und Abfallentsorgung" },
  { id: "packing", label: "Packservice", icon: Box, description: "Ein- und Auspacken" },
  { id: "storage", label: "Lagerung", icon: Warehouse, description: "Zwischenlagerung" },
  { id: "assembly", label: "Möbelmontage", icon: Wrench, description: "Auf- und Abbau" },
];

const formSchema = z.object({
  // Service selection
  services: z.object({
    moving: z.boolean(),
    cleaning: z.boolean(),
    disposal: z.boolean(),
    packing: z.boolean(),
    storage: z.boolean(),
    assembly: z.boolean(),
  }),
  
  // Moving inputs
  rooms: z.string().optional(),
  fromPostal: z.string().optional(),
  toPostal: z.string().optional(),
  floorsFrom: z.number().optional(),
  floorsTo: z.number().optional(),
  hasElevatorFrom: z.boolean().optional(),
  hasElevatorTo: z.boolean().optional(),
  
  // Cleaning inputs
  cleaningType: z.enum(["end-of-lease", "regular", "deep-clean"]).optional(),
  squareMeters: z.number().optional(),
  cleaningRooms: z.number().optional(),
  bathrooms: z.number().optional(),
  hasBalcony: z.boolean().optional(),
  hasWindows: z.boolean().optional(),
  hasOven: z.boolean().optional(),
  hasCarpets: z.boolean().optional(),
  hasStorage: z.boolean().optional(),
  
  // Disposal inputs
  disposalVolume: z.number().optional(),
  hasHazardous: z.boolean().optional(),
  hasElectronics: z.boolean().optional(),
  hasFurniture: z.boolean().optional(),
  disposalDistance: z.number().optional(),
  
  // Packing inputs
  packingRooms: z.number().optional(),
  hasFragileItems: z.boolean().optional(),
  hasArtwork: z.boolean().optional(),
  packingLevel: z.enum(["partial", "full"]).optional(),
  
  // Storage inputs
  storageVolume: z.number().optional(),
  storageDuration: z.number().optional(),
  climateControlled: z.boolean().optional(),
  insurance: z.boolean().optional(),
  accessFrequency: z.enum(["rare", "monthly", "weekly"]).optional(),
  
  // Assembly inputs
  beds: z.number().optional(),
  wardrobes: z.number().optional(),
  shelves: z.number().optional(),
  tables: z.number().optional(),
  chairs: z.number().optional(),
  kitchen: z.number().optional(),
  hasComplexItems: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TotalPriceConfigurator = () => {
  const [step, setStep] = useState(1);
  const [results, setResults] = useState<any>(null);
  
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Gesamtpreis-Konfigurator",
    "name": "Gesamtpreis-Konfigurator - Alle Umzugsservices kombiniert",
    "description": "Kombinieren Sie alle Umzugsservices in einem Tool: Umzug, Reinigung, Entsorgung, Packservice, Lagerung und Möbelmontage. Erhalten Sie ein transparentes Gesamtangebot.",
    "provider": {
      "@type": "Organization",
      "name": "Umzugscheck.ch",
      "url": "https://umzugscheck.ch"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Switzerland"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "CHF",
      "lowPrice": "500",
      "highPrice": "8000"
    },
    "category": "Umzugsdienstleistungen",
    "serviceOutput": "Komplettes Umzugspaket mit allen Services",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Umzugsservices",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Umzugsservice"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Endreinigung"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Entsorgung"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Packservice"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Lagerung"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Möbelmontage"
          }
        }
      ]
    },
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": "https://umzugscheck.ch/gesamtpreis"
    }
  };
  
  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: {
        moving: false,
        cleaning: false,
        disposal: false,
        packing: false,
        storage: false,
        assembly: false,
      },
      hasElevatorFrom: false,
      hasElevatorTo: false,
      hasBalcony: false,
      hasWindows: false,
      hasOven: false,
      hasCarpets: false,
      hasStorage: false,
      hasHazardous: false,
      hasElectronics: false,
      hasFurniture: false,
      hasFragileItems: false,
      hasArtwork: false,
      climateControlled: false,
      insurance: false,
      hasComplexItems: false,
      floorsFrom: 0,
      floorsTo: 0,
      bathrooms: 1,
      cleaningRooms: 3,
      disposalVolume: 5,
      packingRooms: 3,
      storageVolume: 20,
      storageDuration: 1,
      beds: 0,
      wardrobes: 0,
      shelves: 0,
      tables: 0,
      chairs: 0,
      kitchen: 0,
      disposalDistance: 20,
    },
  });

  const selectedServices = watch("services");
  const hasAnyService = Object.values(selectedServices).some(v => v);

  const onSubmit = (data: FormValues) => {
    const calculationResults: any = {
      services: {},
      total: 0,
      totalMin: 0,
      totalMax: 0,
    };

    // Calculate moving
    if (data.services.moving && data.rooms && data.fromPostal && data.toPostal) {
      const movingResult = calculateQuickMovingPrice(
        data.rooms,
        50, // simplified distance
        data.floorsFrom || 0,
        data.floorsTo || 0,
        data.hasElevatorFrom || false,
        data.hasElevatorTo || false
      );
      calculationResults.services.moving = movingResult;
      calculationResults.total += movingResult.breakdown.total;
      calculationResults.totalMin += movingResult.priceMin;
      calculationResults.totalMax += movingResult.priceMax;
    }

    // Calculate cleaning
    if (data.services.cleaning && data.cleaningType && data.squareMeters && data.cleaningRooms && data.bathrooms) {
      const cleaningInput: CleaningCalculatorInput = {
        cleaningType: data.cleaningType,
        squareMeters: data.squareMeters,
        rooms: data.cleaningRooms,
        bathrooms: data.bathrooms,
        hasBalcony: data.hasBalcony || false,
        hasWindows: data.hasWindows || false,
        hasOven: data.hasOven || false,
        hasCarpets: data.hasCarpets || false,
        hasStorage: data.hasStorage || false,
      };
      const cleaningResult = calculateCleaningPrice(cleaningInput);
      calculationResults.services.cleaning = cleaningResult;
      calculationResults.total += cleaningResult.totalPrice;
      calculationResults.totalMin += cleaningResult.priceRange.min;
      calculationResults.totalMax += cleaningResult.priceRange.max;
    }

    // Calculate disposal
    if (data.services.disposal && data.disposalVolume && data.disposalDistance) {
      const disposalInput: DisposalCalculatorInput = {
        volumeM3: data.disposalVolume,
        hasHazardous: data.hasHazardous || false,
        hasElectronics: data.hasElectronics || false,
        hasFurniture: data.hasFurniture || false,
        distance: data.disposalDistance,
      };
      const disposalResult = calculateDisposalPrice(disposalInput);
      calculationResults.services.disposal = disposalResult;
      calculationResults.total += disposalResult.totalPrice;
      calculationResults.totalMin += disposalResult.priceRange.min;
      calculationResults.totalMax += disposalResult.priceRange.max;
    }

    // Calculate packing
    if (data.services.packing && data.packingRooms && data.packingLevel) {
      const packingInput: PackingCalculatorInput = {
        rooms: data.packingRooms,
        hasFragileItems: data.hasFragileItems || false,
        hasArtwork: data.hasArtwork || false,
        packingLevel: data.packingLevel,
      };
      const packingResult = calculatePackingPrice(packingInput);
      calculationResults.services.packing = packingResult;
      calculationResults.total += packingResult.totalPrice;
      calculationResults.totalMin += packingResult.priceRange.min;
      calculationResults.totalMax += packingResult.priceRange.max;
    }

    // Calculate storage
    if (data.services.storage && data.storageVolume && data.storageDuration && data.accessFrequency) {
      const storageInput: StorageCalculatorInput = {
        volumeM3: data.storageVolume,
        duration: data.storageDuration,
        climateControlled: data.climateControlled || false,
        insurance: data.insurance || false,
        accessFrequency: data.accessFrequency,
      };
      const storageResult = calculateStoragePrice(storageInput);
      calculationResults.services.storage = storageResult;
      calculationResults.total += storageResult.monthlyPrice;
      calculationResults.totalMin += storageResult.priceRange.min;
      calculationResults.totalMax += storageResult.priceRange.max;
    }

    // Calculate assembly
    if (data.services.assembly) {
      const assemblyInput: AssemblyCalculatorInput = {
        furnitureItems: {
          beds: data.beds || 0,
          wardrobes: data.wardrobes || 0,
          shelves: data.shelves || 0,
          tables: data.tables || 0,
          chairs: data.chairs || 0,
          kitchen: data.kitchen || 0,
        },
        hasComplexItems: data.hasComplexItems || false,
      };
      const assemblyResult = calculateAssemblyPrice(assemblyInput);
      calculationResults.services.assembly = assemblyResult;
      calculationResults.total += assemblyResult.totalPrice;
      calculationResults.totalMin += assemblyResult.priceRange.min;
      calculationResults.totalMax += assemblyResult.priceRange.max;
    }

    setResults(calculationResults);
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Gesamtpreis-Konfigurator - Alle Services kombiniert | Umzugscheck.ch</title>
        <meta name="description" content="Kombinieren Sie alle Umzugsservices: Umzug, Reinigung, Entsorgung, Packservice, Lagerung & Möbelmontage. ✓ Ein Tool ✓ Transparente Gesamtkosten ✓ Sofort Angebot" />
        <meta name="keywords" content="Gesamtpreis Umzug, Umzug Komplettpreis, All-in-One Umzugsrechner, Umzugspaket Schweiz" />
        <link rel="canonical" href="https://umzugscheck.ch/gesamtpreis" />
        
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
      </Helmet>

      <Navigation />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Gesamtpreis-Konfigurator
              </h1>
              <p className="text-xl text-muted-foreground mb-4">
                Kombinieren Sie alle Services und erhalten Sie ein Gesamtangebot
              </p>
              
              <div className="flex justify-center gap-4 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                      {s}
                    </div>
                    <span className="text-sm text-muted-foreground hidden sm:inline">
                      {s === 1 && "Services wählen"}
                      {s === 2 && "Details eingeben"}
                      {s === 3 && "Angebot ansehen"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Service Selection */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Welche Services benötigen Sie?</CardTitle>
                    <CardDescription>Wählen Sie alle gewünschten Services aus</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-start space-x-3 p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                          onClick={() => setValue(`services.${service.id as keyof typeof selectedServices}`, !selectedServices[service.id as keyof typeof selectedServices])}
                        >
                          <Checkbox
                            id={service.id}
                            checked={selectedServices[service.id as keyof typeof selectedServices]}
                            onCheckedChange={(checked) => 
                              setValue(`services.${service.id as keyof typeof selectedServices}`, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <service.icon className="w-5 h-5 text-primary" />
                              <Label htmlFor={service.id} className="font-semibold cursor-pointer">
                                {service.label}
                              </Label>
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!hasAnyService}
                      className="w-full mt-6"
                      size="lg"
                    >
                      Weiter zu Details
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Service Details */}
              {step === 2 && (
                <div className="space-y-6">
                  {selectedServices.moving && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Umzugsdetails
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Anzahl Zimmer</Label>
                            <Select onValueChange={(value) => setValue("rooms", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Wählen..." />
                              </SelectTrigger>
                              <SelectContent>
                                {["1", "2", "3", "4", "5", "6+"].map((r) => (
                                  <SelectItem key={r} value={r}>{r} Zimmer</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Von PLZ</Label>
                            <Input {...register("fromPostal")} placeholder="z.B. 8000" />
                          </div>
                          <div>
                            <Label>Nach PLZ</Label>
                            <Input {...register("toPostal")} placeholder="z.B. 3000" />
                          </div>
                          <div>
                            <Label>Stockwerk (Von)</Label>
                            <Input type="number" {...register("floorsFrom", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Stockwerk (Nach)</Label>
                            <Input type="number" {...register("floorsTo", { valueAsNumber: true })} />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="elevatorFrom" {...register("hasElevatorFrom")} />
                            <Label htmlFor="elevatorFrom">Lift vorhanden (Von)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="elevatorTo" {...register("hasElevatorTo")} />
                            <Label htmlFor="elevatorTo">Lift vorhanden (Nach)</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedServices.cleaning && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Reinigungsdetails
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Reinigungsart</Label>
                            <Select onValueChange={(value) => setValue("cleaningType", value as any)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Wählen..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="end-of-lease">Endreinigung</SelectItem>
                                <SelectItem value="regular">Reguläre Reinigung</SelectItem>
                                <SelectItem value="deep-clean">Tiefenreinigung</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Quadratmeter</Label>
                            <Input type="number" {...register("squareMeters", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Anzahl Zimmer</Label>
                            <Input type="number" {...register("cleaningRooms", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Anzahl Badezimmer</Label>
                            <Input type="number" {...register("bathrooms", { valueAsNumber: true })} />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasBalcony" {...register("hasBalcony")} />
                            <Label htmlFor="hasBalcony">Balkon vorhanden</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasWindows" {...register("hasWindows")} />
                            <Label htmlFor="hasWindows">Fensterreinigung</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasOven" {...register("hasOven")} />
                            <Label htmlFor="hasOven">Ofenreinigung</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasCarpets" {...register("hasCarpets")} />
                            <Label htmlFor="hasCarpets">Teppichreinigung</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedServices.disposal && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Trash2 className="w-5 h-5" />
                          Entsorgungsdetails
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Volumen (m³)</Label>
                            <Input type="number" {...register("disposalVolume", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Distanz (km)</Label>
                            <Input type="number" {...register("disposalDistance", { valueAsNumber: true })} />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasHazardous" {...register("hasHazardous")} />
                            <Label htmlFor="hasHazardous">Sondermüll</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasElectronics" {...register("hasElectronics")} />
                            <Label htmlFor="hasElectronics">Elektrogeräte</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasFurniture" {...register("hasFurniture")} />
                            <Label htmlFor="hasFurniture">Möbel</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedServices.packing && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Box className="w-5 h-5" />
                          Packservice-Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Anzahl Zimmer</Label>
                            <Input type="number" {...register("packingRooms", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Umfang</Label>
                            <Select onValueChange={(value) => setValue("packingLevel", value as any)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Wählen..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="partial">Teilweise</SelectItem>
                                <SelectItem value="full">Komplett</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasFragileItems" {...register("hasFragileItems")} />
                            <Label htmlFor="hasFragileItems">Zerbrechliche Gegenstände</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="hasArtwork" {...register("hasArtwork")} />
                            <Label htmlFor="hasArtwork">Kunstwerke</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedServices.storage && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Warehouse className="w-5 h-5" />
                          Lagerdetails
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Volumen (m³)</Label>
                            <Input type="number" {...register("storageVolume", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Dauer (Monate)</Label>
                            <Input type="number" {...register("storageDuration", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Zugriffshäufigkeit</Label>
                            <Select onValueChange={(value) => setValue("accessFrequency", value as any)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Wählen..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rare">Selten</SelectItem>
                                <SelectItem value="monthly">Monatlich</SelectItem>
                                <SelectItem value="weekly">Wöchentlich</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="climateControlled" {...register("climateControlled")} />
                            <Label htmlFor="climateControlled">Klimatisiert</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="insurance" {...register("insurance")} />
                            <Label htmlFor="insurance">Versicherung</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {selectedServices.assembly && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="w-5 h-5" />
                          Möbelmontage-Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <Label>Betten</Label>
                            <Input type="number" {...register("beds", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Schränke</Label>
                            <Input type="number" {...register("wardrobes", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Regale</Label>
                            <Input type="number" {...register("shelves", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Tische</Label>
                            <Input type="number" {...register("tables", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Stühle</Label>
                            <Input type="number" {...register("chairs", { valueAsNumber: true })} />
                          </div>
                          <div>
                            <Label>Küchenmöbel</Label>
                            <Input type="number" {...register("kitchen", { valueAsNumber: true })} />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="hasComplexItems" {...register("hasComplexItems")} />
                          <Label htmlFor="hasComplexItems">Komplexe Möbelstücke</Label>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Zurück
                    </Button>
                    <Button type="submit" className="flex-1">
                      Gesamtpreis berechnen
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Results */}
              {step === 3 && results && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Check className="w-6 h-6 text-green-500" />
                      Ihr Gesamtangebot
                    </CardTitle>
                    <CardDescription>
                      Detaillierte Kostenaufstellung für alle gewählten Services
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Individual Service Breakdowns */}
                    <div className="space-y-4">
                      {results.services.moving && (
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Package className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Umzugsservice</h3>
                            </div>
                            <Badge variant="secondary">
                              {formatCurrency(results.services.moving.breakdown.total)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex justify-between">
                              <span>Basispreis:</span>
                              <span>{formatCurrency(results.services.moving.breakdown.basePrice)}</span>
                            </div>
                            {results.services.moving.breakdown.distanceFee > 0 && (
                              <div className="flex justify-between">
                                <span>Distanzzuschlag:</span>
                                <span>{formatCurrency(results.services.moving.breakdown.distanceFee)}</span>
                              </div>
                            )}
                            {results.services.moving.breakdown.floorFee > 0 && (
                              <div className="flex justify-between">
                                <span>Stockwerkszuschlag:</span>
                                <span>{formatCurrency(results.services.moving.breakdown.floorFee)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {results.services.cleaning && (
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Endreinigung</h3>
                            </div>
                            <Badge variant="secondary">
                              {formatCurrency(results.services.cleaning.totalPrice)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex justify-between">
                              <span>Basispreis:</span>
                              <span>{formatCurrency(results.services.cleaning.basePrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Zusatzleistungen:</span>
                              <span>{formatCurrency(results.services.cleaning.servicesPrice)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {results.services.disposal && (
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Trash2 className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Entsorgung</h3>
                            </div>
                            <Badge variant="secondary">
                              {formatCurrency(results.services.disposal.totalPrice)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex justify-between">
                              <span>Entsorgungsgebühr:</span>
                              <span>{formatCurrency(results.services.disposal.disposalFee)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Transportgebühr:</span>
                              <span>{formatCurrency(results.services.disposal.transportFee)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {results.services.packing && (
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Box className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Packservice</h3>
                            </div>
                            <Badge variant="secondary">
                              {formatCurrency(results.services.packing.totalPrice)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div className="flex justify-between">
                              <span>Materialkosten:</span>
                              <span>{formatCurrency(results.services.packing.materialCost)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Arbeitskosten:</span>
                              <span>{formatCurrency(results.services.packing.laborCost)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {results.services.storage && (
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Warehouse className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Lagerung</h3>
                            </div>
                            <Badge variant="secondary">
                              {formatCurrency(results.services.storage.monthlyPrice)}/Monat
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Einrichtungsgebühr:</span>
                              <span>{formatCurrency(results.services.storage.setupFee)} (einmalig)</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {results.services.assembly && (
                        <div className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">Möbelmontage</h3>
                            </div>
                            <Badge variant="secondary">
                              {formatCurrency(results.services.assembly.totalPrice)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Geschätzte Stunden:</span>
                              <span>{results.services.assembly.estimatedHours}h</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Total Price */}
                    <div className="bg-primary/5 rounded-lg p-6">
                      <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">Geschätzter Gesamtpreis</p>
                        <p className="text-4xl font-bold text-primary">
                          {formatCurrency(results.totalMin)} - {formatCurrency(results.totalMax)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Durchschnitt: {formatCurrency(results.total)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1"
                      >
                        Neue Berechnung
                      </Button>
                      <Link to="/kontakt" className="flex-1">
                        <Button className="w-full">
                          Jetzt Offerte anfordern
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>

            {/* SEO Content */}
            <div className="mt-16 prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Gesamtpreis-Konfigurator: Alle Umzugsservices auf einen Blick
              </h2>
              <p className="text-muted-foreground mb-4">
                Unser Gesamtpreis-Konfigurator ermöglicht es Ihnen, alle benötigten Umzugsservices zu kombinieren 
                und ein umfassendes Gesamtangebot zu erhalten. Statt jeden Service einzeln zu kalkulieren, können 
                Sie hier alle Ihre Anforderungen in einem einzigen Formular erfassen.
              </p>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                Kombinierbare Services
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li><strong>Umzugsservice:</strong> Kompletter Transport Ihres Hausrats von A nach B</li>
                <li><strong>Endreinigung:</strong> Professionelle Reinigung der alten und neuen Wohnung</li>
                <li><strong>Entsorgung:</strong> Fachgerechte Entsorgung von Möbeln und Abfällen</li>
                <li><strong>Packservice:</strong> Professionelles Ein- und Auspacken Ihrer Gegenstände</li>
                <li><strong>Lagerung:</strong> Zwischenlagerung bei Bedarf</li>
                <li><strong>Möbelmontage:</strong> Ab- und Aufbau Ihrer Möbel durch Profis</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">
                Vorteile des Gesamtpreis-Konfigurators
              </h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Komplette Übersicht über alle Kosten in einem Angebot</li>
                <li>Zeitersparnis durch einmalige Dateneingabe</li>
                <li>Mögliche Paketrabatte bei Kombination mehrerer Services</li>
                <li>Perfekte Koordination aller Leistungen durch einen Anbieter</li>
                <li>Transparente Preisaufstellung für jeden einzelnen Service</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TotalPriceConfigurator;
