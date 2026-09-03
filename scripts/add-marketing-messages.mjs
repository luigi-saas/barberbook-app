/**
 * Adds the marketing-cluster namespaces (pricing, contact, blog, legal,
 * marketing nav/footer) and rebrands web.home.meta — all locales.
 * Run: node scripts/add-marketing-messages.mjs
 */
import fs from "node:fs";

const data = {
  fr: {
    homeMeta: {
      title: "BarberBook.ma — Réservez chez les meilleurs barbiers du Maroc",
      description:
        "Réservez votre coupe, barbe ou rituel de grooming chez les salons partenaires à Casablanca, Rabat et Marrakech. Confirmation instantanée, sans appel.",
    },
    marketing: {
      nav: {
        home: "Accueil",
        explore: "Salons",
        booking: "Réserver",
        pricing: "Tarifs",
        blog: "Blog",
        contact: "Contact",
        login: "Connexion",
        signUp: "Devenir partenaire",
      },
      footer: {
        tagline:
          "La plateforme de réservation des barbiers marocains. Confirmation instantanée, zéro appel.",
        product: "Produit",
        company: "Entreprise",
        legal: "Légal",
        rights: "© 2026 BarberBook.ma — Casablanca, Maroc",
        privacy: "Confidentialité",
        terms: "Conditions",
      },
    },
    pricing: {
      meta: {
        title: "Tarifs — Développez votre salon avec BarberBook",
        description:
          "Des tarifs simples en MAD pour les salons marocains. Commencez gratuitement, évoluez quand votre planning se remplit.",
      },
      title: "Un tarif clair, pensé pour les salons marocains",
      subtitle:
        "Commencez gratuitement. Passez à la vitesse supérieure quand votre planning se remplit.",
      perMonth: "/ mois",
      popular: "Populaire",
      cta: "Commencer",
      ctaFree: "Créer mon compte",
      contactCta: "Parler à l'équipe",
      plans: {
        free: {
          name: "Découverte",
          tagline: "Pour tester BarberBook sans engagement.",
          features: [
            "Page salon + réservation en ligne",
            "Jusqu'à 10 réservations / mois",
            "Confirmations par e-mail",
            "Paiement au salon",
          ],
        },
        starter: {
          name: "Essentiel",
          tagline: "Pour l'artisan seul ou le petit salon.",
          features: [
            "Réservations illimitées",
            "Profil mis en avant dans l'annuaire",
            "Confirmations WhatsApp",
            "Gestion de l'équipe (3 barbiers)",
          ],
        },
        pro: {
          name: "Pro",
          tagline: "Pour le salon qui tourne à plein régime.",
          features: [
            "Tout Essentiel, plus :",
            "Statistiques & revenus en temps réel",
            "File d'attente & clients de passage",
            "Programme de fidélité",
            "Barbiers illimités",
          ],
        },
        elite: {
          name: "Réseau",
          tagline: "Pour les multi-salons et franchises.",
          features: [
            "Tout Pro, plus :",
            "Plusieurs établissements",
            "Accès API",
            "Support prioritaire",
            "Accompagnement dédié",
          ],
        },
      },
      note: "Sans engagement. Payez en MAD, annulez quand vous voulez.",
    },
    contact: {
      meta: {
        title: "Contact — BarberBook.ma",
        description:
          "Une question sur BarberBook ? Écrivez-nous, nous répondons sous 24 h ouvrées.",
      },
      title: "Parlons de votre salon",
      subtitle:
        "Une question, une demande de démonstration, un partenariat ? Écrivez-nous.",
      name: "Votre nom",
      email: "Votre e-mail",
      message: "Votre message",
      send: "Envoyer",
      sending: "Envoi…",
      successTitle: "Message envoyé !",
      successText: "Nous revenons vers vous sous 24 h ouvrées.",
      errorTitle: "Le message n'a pas pu partir",
    },
    blog: {
      meta: {
        title: "Le Magazine — BarberBook.ma",
        description:
          "Conseils grooming, tendances coupes et coulisses des meilleurs barbiers du Maroc.",
      },
      emptyTitle: "Le magazine arrive bientôt",
      emptyText:
        "Nos rédacteurs préparent déjà des guides grooming, des interviews de maîtres barbiers et les tendances coupes du Royaume.",
    },
    legal: {
      back: "Retour à l'accueil",
      privacy: {
        title: "Confidentialité",
        description:
          "Comment BarberBook.ma collecte, utilise et protège vos données.",
        body: [
          "BarberBook.ma collecte uniquement les données nécessaires à la prise de rendez-vous : nom, numéro de téléphone, e-mail et historique de réservations. Ces données servent à confirmer vos rendez-vous, à permettre au salon de vous retrouver et à améliorer le service.",
          "Vos données ne sont jamais revendues. Les salons partenaires accèdent uniquement aux informations indispensables à votre rendez-vous (nom, téléphone, notes de prestation).",
          "Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment à privacy@barberbook.ma. Les réservations passées peuvent être conservées pour raisons comptables, conformément à la loi marocaine (loi 09-08).",
          "Les paiements sont réglés directement au salon. BarberBook.ma ne stocke aucune donnée bancaire.",
        ],
      },
      terms: {
        title: "Conditions d'utilisation",
        description:
          "Les règles qui encadrent l'utilisation de BarberBook.ma.",
        body: [
          "BarberBook.ma est une plateforme de mise en relation entre clients et salons de coiffure partenaires. La réservation est confirmée immédiatement et le paiement s'effectue directement au salon.",
          "Annulation : vous pouvez annuler gratuitement jusqu'à 2 heures avant le rendez-vous. Les retards de plus de 15 minutes peuvent entraîner la perte du créneau au profit des clients de passage.",
          "Le salon s'engage à honorer les créneaux réservés et à fournir la prestation décrite. En cas de litige, BarberBook.ma intervient comme médiateur.",
          "Ces conditions sont régies par le droit marocain. Tout litige relève des tribunaux de Casablanca.",
        ],
      },
      notFound: "Document introuvable.",
    },
  },
  en: {
    homeMeta: {
      title: "BarberBook.ma — Book Morocco's best barbers",
      description:
        "Book your cut, beard or grooming ritual at partner shops in Casablanca, Rabat and Marrakech. Instant confirmation, no phone calls.",
    },
    marketing: {
      nav: {
        home: "Home",
        explore: "Shops",
        booking: "Book now",
        pricing: "Pricing",
        blog: "Blog",
        contact: "Contact",
        login: "Log in",
        signUp: "Become a partner",
      },
      footer: {
        tagline:
          "The booking platform for Moroccan barbershops. Instant confirmation, zero phone calls.",
        product: "Product",
        company: "Company",
        legal: "Legal",
        rights: "© 2026 BarberBook.ma — Casablanca, Morocco",
        privacy: "Privacy",
        terms: "Terms",
      },
    },
    pricing: {
      meta: {
        title: "Pricing — Grow your shop with BarberBook",
        description:
          "Simple MAD pricing for Moroccan barbershops. Start free, upgrade as your calendar fills up.",
      },
      title: "Simple pricing, built for Moroccan barbershops",
      subtitle: "Start free. Upgrade when your calendar fills up.",
      perMonth: "/ month",
      popular: "Popular",
      cta: "Get started",
      ctaFree: "Create my account",
      contactCta: "Talk to us",
      plans: {
        free: {
          name: "Discovery",
          tagline: "Try BarberBook with zero commitment.",
          features: [
            "Shop page + online booking",
            "Up to 10 bookings / month",
            "Email confirmations",
            "Pay at the shop",
          ],
        },
        starter: {
          name: "Essential",
          tagline: "For solo artisans and small shops.",
          features: [
            "Unlimited bookings",
            "Featured placement in the directory",
            "WhatsApp confirmations",
            "Team management (3 barbers)",
          ],
        },
        pro: {
          name: "Pro",
          tagline: "For shops running at full speed.",
          features: [
            "Everything in Essential, plus:",
            "Real-time revenue analytics",
            "Walk-in queue management",
            "Loyalty program",
            "Unlimited barbers",
          ],
        },
        elite: {
          name: "Network",
          tagline: "For multi-location shops and franchises.",
          features: [
            "Everything in Pro, plus:",
            "Multiple locations",
            "API access",
            "Priority support",
            "Dedicated onboarding",
          ],
        },
      },
      note: "No commitment. Pay in MAD, cancel anytime.",
    },
    contact: {
      meta: {
        title: "Contact — BarberBook.ma",
        description:
          "Questions about BarberBook? Write to us, we reply within 24 business hours.",
      },
      title: "Let's talk about your shop",
      subtitle: "A question, a demo request, a partnership? Write to us.",
      name: "Your name",
      email: "Your email",
      message: "Your message",
      send: "Send",
      sending: "Sending…",
      successTitle: "Message sent!",
      successText: "We'll get back to you within 24 business hours.",
      errorTitle: "The message could not be sent",
    },
    blog: {
      meta: {
        title: "The Magazine — BarberBook.ma",
        description:
          "Grooming advice, haircut trends and behind the scenes of Morocco's best barbers.",
      },
      emptyTitle: "The magazine is coming soon",
      emptyText:
        "Our writers are preparing grooming guides, master barber interviews and the Kingdom's haircut trends.",
    },
    legal: {
      back: "Back to home",
      privacy: {
        title: "Privacy",
        description: "How BarberBook.ma collects, uses and protects your data.",
        body: [
          "BarberBook.ma collects only the data needed to manage appointments: name, phone number, email and booking history. This data is used to confirm your bookings, help the shop find you, and improve the service.",
          "Your data is never sold. Partner shops access only the information essential to your appointment (name, phone, service notes).",
          "You can request access, correction or deletion of your data at any time at privacy@barberbook.ma. Past bookings may be kept for accounting purposes, in accordance with Moroccan law (law 09-08).",
          "Payments are made directly at the shop. BarberBook.ma stores no banking data.",
        ],
      },
      terms: {
        title: "Terms of use",
        description: "The rules that govern the use of BarberBook.ma.",
        body: [
          "BarberBook.ma is a platform connecting clients with partner barbershops. Bookings are confirmed instantly and payment is made directly at the shop.",
          "Cancellation: you can cancel free of charge up to 2 hours before the appointment. Delays over 15 minutes may result in the slot being given to walk-in clients.",
          "The shop commits to honouring booked slots and providing the service as described. In case of dispute, BarberBook.ma acts as mediator.",
          "These terms are governed by Moroccan law. Any dispute falls under the courts of Casablanca.",
        ],
      },
      notFound: "Document not found.",
    },
  },
  ar: {
    homeMeta: {
      title: "BarberBook.ma — احجز عند أفضل حلاقي المغرب",
      description:
        "احجز قصتك أو لحيتك أو طقوس العناية في الصالونات الشريكة بالدار البيضاء والرباط ومراكش. تأكيد فوري بدون مكالمات.",
    },
    marketing: {
      nav: {
        home: "الرئيسية",
        explore: "الصالونات",
        booking: "احجز الآن",
        pricing: "الأسعار",
        blog: "المدونة",
        contact: "اتصل بنا",
        login: "تسجيل الدخول",
        signUp: "كن شريكًا",
      },
      footer: {
        tagline: "منصة الحجز لحلاقي المغرب. تأكيد فوري، بدون مكالمات.",
        product: "المنتج",
        company: "الشركة",
        legal: "قانوني",
        rights: "© 2026 BarberBook.ma — الدار البيضاء، المغرب",
        privacy: "الخصوصية",
        terms: "الشروط",
      },
    },
    pricing: {
      meta: {
        title: "الأسعار — طوّر صالونك مع BarberBook",
        description:
          "أسعار واضحة بالدرهم للصالونات المغربية. ابدأ مجانًا وطوّر اشتراكك مع امتلاء جدولك.",
      },
      title: "أسعار واضحة، مصممة للصالونات المغربية",
      subtitle: "ابدأ مجانًا. رقِّ اشتراكك عندما يمتلئ جدولك.",
      perMonth: "/ شهر",
      popular: "الأكثر شعبية",
      cta: "ابدأ الآن",
      ctaFree: "أنشئ حسابي",
      contactCta: "تحدث معنا",
      plans: {
        free: {
          name: "اكتشاف",
          tagline: "جرّب BarberBook بدون التزام.",
          features: [
            "صفحة الصالون + حجز عبر الإنترنت",
            "حتى 10 حجوزات شهريًا",
            "تأكيدات بالبريد الإلكتروني",
            "الدفع في الصالون",
          ],
        },
        starter: {
          name: "أساسي",
          tagline: "للحرفي الفردي والصالون الصغير.",
          features: [
            "حجوزات غير محدودة",
            "ظهور مميز في الدليل",
            "تأكيدات واتساب",
            "إدارة الفريق (3 حلاقين)",
          ],
        },
        pro: {
          name: "برو",
          tagline: "للصالون الذي يعمل بكامل طاقته.",
          features: [
            "كل مزايا الأساسي، بالإضافة إلى:",
            "إحصائيات وإيرادات في الوقت الفعلي",
            "إدارة قائمة الانتظار والعملاء الفوريين",
            "برنامج الولاء",
            "حلاقون بلا حدود",
          ],
        },
        elite: {
          name: "شبكة",
          tagline: "للمجموعات والامتيازات متعددة الفروع.",
          features: [
            "كل مزايا برو، بالإضافة إلى:",
            "عدة فروع",
            "وصول API",
            "دعم ذو أولوية",
            "مرافقة مخصصة",
          ],
        },
      },
      note: "بدون التزام. ادفع بالدرهم، وألغِ متى شئت.",
    },
    contact: {
      meta: {
        title: "اتصل بنا — BarberBook.ma",
        description: "سؤال عن BarberBook؟ راسلنا، نرد خلال 24 ساعة عمل.",
      },
      title: "لنتحدث عن صالونك",
      subtitle: "سؤال، طلب عرض توضيحي، شراكة؟ راسلنا.",
      name: "اسمك",
      email: "بريدك الإلكتروني",
      message: "رسالتك",
      send: "إرسال",
      sending: "جارٍ الإرسال…",
      successTitle: "تم إرسال الرسالة!",
      successText: "سنعود إليك خلال 24 ساعة عمل.",
      errorTitle: "تعذّر إرسال الرسالة",
    },
    blog: {
      meta: {
        title: "المجلة — BarberBook.ma",
        description: "نصائح العناية، صيحات القص، وكواليس أفضل حلاقي المغرب.",
      },
      emptyTitle: "المجلة قريبًا",
      emptyText:
        "يعدّ محررونا أدلة للعناية، وحوارات مع كبار الحلاقين، وصيحات القص في المملكة.",
    },
    legal: {
      back: "العودة إلى الرئيسية",
      privacy: {
        title: "الخصوصية",
        description: "كيف يجمع BarberBook.ma بياناتك ويستخدمها ويحميها.",
        body: [
          "يجمع BarberBook.ma فقط البيانات اللازمة لإدارة المواعيد: الاسم ورقم الهاتف والبريد الإلكتروني وسجل الحجوزات. تُستخدم هذه البيانات لتأكيد مواعيدك ومساعدة الصالون في التعرف عليك وتحسين الخدمة.",
          "بياناتك لا تُباع أبدًا. تصل الصالونات الشريكة فقط إلى المعلومات الضرورية لموعدك (الاسم، الهاتف، ملاحظات الخدمة).",
          "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت عبر privacy@barberbook.ma. قد تُحفظ الحجوزات السابقة لأسباب محاسبية وفقًا للقانون المغربي (القانون 09-08).",
          "تُدفع المدفوعات مباشرة في الصالون. لا يحتفظ BarberBook.ma بأي بيانات بنكية.",
        ],
      },
      terms: {
        title: "شروط الاستخدام",
        description: "القواعد التي تنظم استخدام BarberBook.ma.",
        body: [
          "BarberBook.ma منصة تربط العملاء بالصالونات الشريكة. يتم تأكيد الحجز فورًا ويتم الدفع مباشرة في الصالون.",
          "الإلغاء: يمكنك الإلغاء مجانًا حتى ساعتين قبل الموعد. قد يؤدي التأخير أكثر من 15 دقيقة إلى منح موعدك لعميل آخر.",
          "يتعهد الصالون باحترام المواعيد المحجوزة وتقديم الخدمة كما هي موصوفة. في حال النزاع، يتوسط BarberBook.ma لحلّه.",
          "تخضع هذه الشروط للقانون المغربي، وتختص محاكم الدار البيضاء بأي نزاع.",
        ],
      },
      notFound: "المستند غير موجود.",
    },
  },
};

for (const [loc, patch] of Object.entries(data)) {
  const path = `apps/web/messages/${loc}.json`;
  const d = JSON.parse(fs.readFileSync(path, "utf8"));
  d.web.home.meta = patch.homeMeta;
  for (const key of ["marketing", "pricing", "contact", "blog", "legal"]) {
    d.web[key] = patch[key];
  }
  fs.writeFileSync(path, JSON.stringify(d, null, 2) + "\n");
  console.log(loc, "updated");
}
