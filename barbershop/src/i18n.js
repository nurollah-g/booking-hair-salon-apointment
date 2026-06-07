export const translations = {
  en: {
    // Navbar
    home: "Home",
    portfolio: "Portfolio",
    about: "About",
    ourSocials: "OUR SOCIALS",

    // Home
    bookNow: "BOOK NOW",
    premiumGrooming: "Premium Haircut Experience",

    // SelectionPage
    yourExperience: "YOUR EXPERIENCE",
    personalizeVisit: "PERSONALIZE YOUR VISIT",
    selectBarber: "01 · Select Barber",
    selectServices: "02 · Select Services",
    servicesSelected: (n) => `${n} service${n > 1 ? "s" : ""} selected`,
    continue: "CONTINUE",
    close: "Close",

    // Barber roles
    seniorBarber: "Senior Barber",
    hairSpecialist: "Hair Specialist",
    colorExpert: "Color Expert",
    yrsExp: (n) => `${n} yrs exp`,

    // Services
    haircutLabel: "Haircut",
    haircutDesc: "Classic & modern cuts",
    permLabel: "Hair Perm",
    permDesc: "Curling & waving",
    colorLabel: "Hair Color",
    colorDesc: "Full color & highlights",
    groomLabel: "Groom Package",
    groomDesc: "Full bridal grooming",
    facialLabel: "Facial",
    facialDesc: "Deep cleanse & care",

    // BookingForm
    bookingForm: "BOOKING FORM",
    barberLabel: "Barber:",
    servicesLabel: "Services:",
    fullNamePlaceholder: "Full Name (First Last)",
    fullNameError: "Enter first and last name (min 2 chars each)",
    phonePlaceholder: "664 1234567",
    phoneError: "Enter a valid Austrian number (9-10 digits)",
    dateNote: "* Sat–Thu only, within next 7 days",
    fridayError: "Fridays are not working days. Please select another day.",
    dateRangeError: "Please select a date within the next 7 days.",
    timePlaceholder: "Select Time (11:00 – 19:00)",
    submit: "SUBMIT",
    sending: "SENDING...",
    submitted: "✓ SUBMITTED",
    serverError: "Unable to connect to server. Please try again.",

    // Auth
    verification: "VERIFICATION",
    codeSentTo: "Enter the 6-digit code sent to",
    enterFullCode: "Please enter the full 6-digit code",
    verifying: "VERIFYING...",
    verify: "VERIFY",
    didntReceive: "Didn't receive the code?",
    resendCode: "Resend Code",
    resendIn: (s) => `Resend in ${s}s`,
    cancel: "Cancel",

    // ReservationDashboard
    loading: "LOADING...",
    noActiveReservation: "No Active Reservation",
    invalidLink: "This booking link is invalid or has been cancelled.",
    backToHome: "BACK TO HOME",
    reservationConfirmed: "RESERVATION CONFIRMED",
    reservationCode: "Reservation Code",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    date: "Date",
    time: "Time",
    barber: "Barber",
    services: "Services",
    bookedOn: "Booked on:",
    cancelReservation: "Cancel Reservation",
    cancelQuestion: "Cancel Reservation?",
    cannotUndo: "This action cannot be undone.",
    keepIt: "Keep It",
    yesCancel: "Yes, Cancel",
    cancelSuccess: "Your reservation has been successfully cancelled.",

    // About
    contactUs: "Contact Us",
    phone: "Phone",
    email: "Email",
    address: "Address",
    workingHours: "Working Hours",
    workingHoursValue: "Sat – Thu · 11:00 – 19:00",

    // Portfolio
    videoPortfolio: "VIDEO",
    videoPortfolioSub: "PORTFOLIO",
    portfolioDesc:
      "Explore our craft through cinematic visuals — from precision cuts to complete transformations",
    videos: (n) => `${n} VIDEOS`,
    cinematic: "4K CINEMATIC",
    readyTransformation: "READY FOR A TRANSFORMATION?",
    bookAppointment: "BOOK YOUR APPOINTMENT",
    all: "ALL",
    tutorial: "TUTORIAL",
    beforeAfter: "BEFORE/AFTER",
    service: "SERVICE",
    technique: "TECHNIQUE",
    behindScenes: "BEHIND SCENES",
    testimonial: "TESTIMONIAL",
  },

  de: {
    // Navbar
    home: "Startseite",
    portfolio: "Portfolio",
    about: "Über uns",
    ourSocials: "SOZIALE MEDIEN",

    // Home
    bookNow: "JETZT BUCHEN",
    premiumGrooming: "Premium Haarschnitt-Erlebnis",

    // SelectionPage
    yourExperience: "IHR ERLEBNIS",
    personalizeVisit: "PERSONALISIEREN SIE IHREN BESUCH",
    selectBarber: "01 · Friseur wählen",
    selectServices: "02 · Leistungen wählen",
    servicesSelected: (n) => `${n} Leistung${n > 1 ? "en" : ""} ausgewählt`,
    continue: "WEITER",
    close: "Schließen",

    // Barber roles
    seniorBarber: "Senior Friseur",
    hairSpecialist: "Haar-Spezialist",
    colorExpert: "Farb-Experte",
    yrsExp: (n) => `${n} Jahre Erfahrung`,

    // Services
    haircutLabel: "Haarschnitt",
    haircutDesc: "Klassische & moderne Schnitte",
    permLabel: "Dauerwelle",
    permDesc: "Locken & Wellen",
    colorLabel: "Haarfärbung",
    colorDesc: "Vollfarbe & Highlights",
    groomLabel: "Bräutigam-Paket",
    groomDesc: "Vollständige Bräutigam-Pflege",
    facialLabel: "Gesichtsbehandlung",
    facialDesc: "Tiefenreinigung & Pflege",

    // BookingForm
    bookingForm: "BUCHUNGSFORMULAR",
    barberLabel: "Friseur:",
    servicesLabel: "Leistungen:",
    fullNamePlaceholder: "Vollständiger Name (Vor- Nachname)",
    fullNameError: "Vor- und Nachname eingeben (min. 2 Zeichen)",
    phonePlaceholder: "+43 xxx xxxxxxx",
    phonePrefix: "+43",
    phoneError: "Muss mit 09 beginnen und 11 Ziffern haben",
    dateNote: "* Sa–Do, innerhalb der nächsten 7 Tage",
    fridayError: "Freitags ist Ruhetag. Bitte wählen Sie einen anderen Tag.",
    dateRangeError: "Bitte wählen Sie ein Datum innerhalb der nächsten 7 Tage.",
    timePlaceholder: "Uhrzeit wählen (11:00 – 19:00)",
    submit: "ABSENDEN",
    sending: "WIRD GESENDET...",
    submitted: "✓ ABGESENDET",
    serverError: "Keine Verbindung zum Server. Bitte versuchen Sie es erneut.",

    // Auth
    verification: "VERIFIZIERUNG",
    codeSentTo: "Geben Sie den 6-stelligen Code ein, der gesendet wurde an",
    enterFullCode: "Bitte geben Sie den vollständigen 6-stelligen Code ein",
    verifying: "WIRD VERIFIZIERT...",
    verify: "BESTÄTIGEN",
    didntReceive: "Keinen Code erhalten?",
    resendCode: "Code erneut senden",
    resendIn: (s) => `Erneut senden in ${s}s`,
    cancel: "Abbrechen",

    // ReservationDashboard
    loading: "WIRD GELADEN...",
    noActiveReservation: "Keine aktive Reservierung",
    invalidLink: "Dieser Buchungslink ist ungültig oder wurde storniert.",
    backToHome: "ZURÜCK ZUR STARTSEITE",
    reservationConfirmed: "RESERVIERUNG BESTÄTIGT",
    reservationCode: "Reservierungscode",
    fullName: "Vollständiger Name",
    phoneNumber: "Telefonnummer",
    date: "Datum",
    time: "Uhrzeit",
    barber: "Friseur",
    services: "Leistungen",
    bookedOn: "Gebucht am:",
    cancelReservation: "Reservierung stornieren",
    cancelQuestion: "Reservierung stornieren?",
    cannotUndo: "Diese Aktion kann nicht rückgängig gemacht werden.",
    keepIt: "Behalten",
    yesCancel: "Ja, stornieren",
    cancelSuccess: "Ihre Reservierung wurde erfolgreich storniert.",

    // About
    contactUs: "Kontakt",
    phone: "Telefon",
    email: "E-Mail",
    address: "Adresse",
    workingHours: "Öffnungszeiten",
    workingHoursValue: "Sa – Do · 11:00 – 19:00 Uhr",

    // Portfolio
    videoPortfolio: "VIDEO",
    videoPortfolioSub: "PORTFOLIO",
    portfolioDesc:
      "Entdecken Sie unser Handwerk durch cinematische Visuals — von präzisen Schnitten bis zu kompletten Transformationen",
    videos: (n) => `${n} VIDEOS`,
    cinematic: "4K CINEMATIC",
    readyTransformation: "BEREIT FÜR EINE TRANSFORMATION?",
    bookAppointment: "TERMIN BUCHEN",
    all: "ALLE",
    tutorial: "TUTORIAL",
    beforeAfter: "VORHER/NACHHER",
    service: "SERVICE",
    technique: "TECHNIK",
    behindScenes: "HINTER DEN KULISSEN",
    testimonial: "KUNDENSTIMMEN",
  },
};
