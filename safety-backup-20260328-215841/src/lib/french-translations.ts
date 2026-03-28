/**
 * French Translations (Romandie)
 * Complete French translation for the Swiss French-speaking region
 */

export const FR_TRANSLATIONS = {
  // Navigation
  nav: {
    priceCalculator: 'Calculateur',
    movingCompanies: 'Entreprises',
    services: 'Services',
    regions: 'Régions',
    guides: 'Guides',
    forCompanies: 'Pour entreprises',
    getQuotes: 'Recevoir des offres'
  },
  
  // Hero Section
  hero: {
    title: 'Comparez les déménageurs suisses',
    subtitle: 'Gratuit, sans engagement et en seulement 2 minutes',
    cta: 'Calculer le prix maintenant',
    ctaSecondary: 'Voir les entreprises',
    trustBadge1: '100% gratuit',
    trustBadge2: 'Sans engagement',
    trustBadge3: 'Entreprises vérifiées',
    customerCount: 'Plus de 50\'000 clients satisfaits'
  },
  
  // Calculator
  calculator: {
    title: 'Calculez le prix de votre déménagement',
    step1: 'D\'où déménagez-vous?',
    step2: 'Où allez-vous?',
    step3: 'Quand déménagez-vous?',
    step4: 'Détails du logement',
    step5: 'Votre inventaire',
    step6: 'Services supplémentaires',
    step7: 'Vos coordonnées',
    step8: 'Récapitulatif',
    
    fromAddress: 'Adresse actuelle',
    toAddress: 'Nouvelle adresse',
    postalCode: 'Code postal',
    city: 'Ville',
    street: 'Rue',
    moveDate: 'Date du déménagement',
    flexibility: 'Flexibilité',
    flexibilityOptions: {
      exact: 'Date exacte',
      oneWeek: '± 1 semaine',
      twoWeeks: '± 2 semaines',
      flexible: 'Flexible'
    },
    
    rooms: 'Nombre de pièces',
    floor: 'Étage',
    hasLift: 'Y a-t-il un ascenseur?',
    parkingDistance: 'Distance de stationnement',
    
    furniture: 'Meubles',
    boxes: 'Cartons',
    specialItems: 'Objets spéciaux',
    
    services: {
      packing: 'Service d\'emballage',
      packingDesc: 'Nous emballons vos affaires',
      cleaning: 'Nettoyage final',
      cleaningDesc: 'Nettoyage de remise de l\'appartement',
      storage: 'Garde-meuble',
      storageDesc: 'Stockage temporaire',
      disposal: 'Élimination',
      disposalDesc: 'Élimination des objets encombrants',
      furniture: 'Montage de meubles',
      furnitureDesc: 'Démontage et remontage'
    },
    
    contact: {
      name: 'Nom complet',
      email: 'Adresse e-mail',
      phone: 'Numéro de téléphone',
      comments: 'Remarques supplémentaires'
    },
    
    summary: {
      title: 'Récapitulatif de votre déménagement',
      from: 'De',
      to: 'À',
      date: 'Date',
      volume: 'Volume estimé',
      services: 'Services sélectionnés',
      estimatedPrice: 'Prix estimé',
      disclaimer: 'Prix indicatif, les offres définitives vous seront envoyées par e-mail.'
    },
    
    buttons: {
      next: 'Suivant',
      back: 'Retour',
      submit: 'Recevoir les offres',
      calculating: 'Calcul en cours...'
    },
    
    validation: {
      required: 'Ce champ est obligatoire',
      invalidEmail: 'Adresse e-mail invalide',
      invalidPhone: 'Numéro de téléphone invalide',
      invalidPostal: 'Code postal invalide'
    }
  },
  
  // Companies
  companies: {
    title: 'Entreprises de déménagement',
    subtitle: 'Comparez les meilleurs déménageurs suisses',
    filters: {
      region: 'Région',
      services: 'Services',
      rating: 'Évaluation',
      priceLevel: 'Niveau de prix',
      sort: 'Trier par'
    },
    sortOptions: {
      recommended: 'Recommandé',
      rating: 'Meilleure note',
      reviews: 'Plus d\'avis',
      price: 'Prix le plus bas'
    },
    priceLevel: {
      budget: 'Économique',
      standard: 'Standard',
      premium: 'Premium'
    },
    card: {
      verified: 'Vérifié',
      featured: 'En vedette',
      reviews: 'avis',
      responseTime: 'Délai de réponse',
      hours: 'heures',
      getQuote: 'Demander une offre',
      viewProfile: 'Voir le profil'
    },
    noResults: 'Aucune entreprise trouvée avec ces critères.',
    showMore: 'Afficher plus d\'entreprises'
  },
  
  // Services
  services: {
    privateMove: {
      title: 'Déménagement privé',
      description: 'Déménagement complet de votre maison ou appartement'
    },
    businessMove: {
      title: 'Déménagement d\'entreprise',
      description: 'Relocalisation d\'entreprises et de bureaux'
    },
    seniorMove: {
      title: 'Déménagement seniors',
      description: 'Service attentionné pour les personnes âgées'
    },
    cleaning: {
      title: 'Nettoyage final',
      description: 'Nettoyage de remise professionnel'
    },
    disposal: {
      title: 'Élimination',
      description: 'Élimination écologique des objets encombrants'
    },
    storage: {
      title: 'Garde-meuble',
      description: 'Stockage sécurisé de vos biens'
    },
    international: {
      title: 'Déménagement international',
      description: 'Déménagement à l\'étranger'
    },
    specialty: {
      title: 'Transports spéciaux',
      description: 'Pianos, coffres-forts, œuvres d\'art'
    }
  },
  
  // Regions
  regions: {
    title: 'Déménagements par région',
    zurich: 'Zurich',
    geneva: 'Genève',
    basel: 'Bâle',
    bern: 'Berne',
    lausanne: 'Lausanne',
    winterthur: 'Winterthour',
    lucerne: 'Lucerne',
    stGallen: 'Saint-Gall',
    lugano: 'Lugano',
    viewAll: 'Voir toutes les régions'
  },
  
  // Footer
  footer: {
    about: 'À propos',
    aboutText: 'Umzugscheck.ch est la première plateforme de comparaison de déménagement en Suisse.',
    services: 'Services',
    legal: 'Informations légales',
    contact: 'Contact',
    imprint: 'Mentions légales',
    privacy: 'Protection des données',
    terms: 'Conditions générales',
    copyright: '© 2025 Umzugscheck.ch - Tous droits réservés'
  },
  
  // Common
  common: {
    loading: 'Chargement...',
    error: 'Une erreur s\'est produite',
    retry: 'Réessayer',
    close: 'Fermer',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    all: 'Tous',
    none: 'Aucun',
    yes: 'Oui',
    no: 'Non',
    or: 'ou',
    and: 'et',
    free: 'Gratuit',
    from: 'dès',
    chf: 'CHF',
    perMonth: '/mois',
    perYear: '/an'
  },
  
  // Trust Signals
  trust: {
    verifiedCompanies: 'Entreprises vérifiées',
    freeService: '100% gratuit',
    noObligation: 'Sans engagement',
    swissQuality: 'Qualité suisse',
    dataProtection: 'Protection des données suisse',
    securePayment: 'Paiement sécurisé',
    satisfactionGuarantee: 'Garantie satisfaction',
    customerSupport: 'Support client'
  },
  
  // Errors
  errors: {
    generic: 'Quelque chose s\'est mal passé. Veuillez réessayer.',
    network: 'Erreur de connexion. Vérifiez votre connexion internet.',
    notFound: 'Page non trouvée',
    unauthorized: 'Accès non autorisé',
    validation: 'Veuillez vérifier vos entrées'
  },
  
  // Success Messages
  success: {
    quoteSent: 'Votre demande a été envoyée avec succès!',
    saved: 'Enregistré avec succès',
    deleted: 'Supprimé avec succès',
    updated: 'Mis à jour avec succès'
  }
};

export type FrenchTranslations = typeof FR_TRANSLATIONS;
