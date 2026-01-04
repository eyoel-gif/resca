export type Language = 'en' | 'am' | 'ar';

export const TRANSLATIONS = {
  en: {
    nav: {
      marketplace: "Marketplace",
      shops: "Suppliers",
      login: "Log In",
      register: "Register",
      dashboard: "Dashboard"
    },
    hero: {
      tagline: "The World for Ethiopian Kitchens",
      title_start: "Equip Like a",
      title_end: "Queen",
      subtitle: "The first immersive marketplace for Hotel, Restaurant, and Cafe professionals in Ethiopia. Secure premium equipment with just a 10% reserve.",
      cta_browse: "Start Browsing",
      cta_sell: "Sell Equipment",
      verified: "Verified Sellers",
      fayda: "Fayda Integrated",
      phase3: "3-Phase Tested"
    },
    auth: {
      welcome: "Welcome to Resca",
      welcome_back: "Welcome Back",
      create_account: "Create Account",
      phone_subtitle: "Enter your phone number to access the Kitchen Queen.",
      phone_label: "Phone Number",
      send_code: "Send Code",
      verify_phone: "Verify Phone",
      enter_code: "Enter the code sent to",
      verify_btn: "Verify",
      resend: "Resend",
      identity_check: "Identity Check",
      fayda_label: "Fayda ID Number",
      fayda_desc: "To ensure a safe marketplace, Resca requires a valid Fayda ID. Your data is encrypted.",
      verify_id: "Verify Identity",
      boost_trust: "Boost Trust",
      connect_tele: "Connect Telebirr",
      tele_desc: "Get the \"Verified Payer\" badge and enable one-tap 10% deposits.",
      link_account: "Link Account",
      skip: "Skip for now",
      logging_in: "Logging you in...",
      terms: "By accessing Resca, you agree to the Terms of Service & Privacy Policy."
    },
    compare: {
      dock_title: "Compare Items",
      compare_now: "Compare Now",
      clear_all: "Clear All",
      add_to_compare: "Add to Compare",
      remove: "Remove",
      vs: "VS",
      specs: "Specifications",
      price_breakdown: "Price Breakdown",
      technical_specs: "Technical Specs",
      empty_dock: "Select items to compare"
    },
    unlock: {
      pay_to_view: "Pay to View Price",
      unlock_price: "Unlock Price & Info",
      unlock_fee: "10 ETB Access Fee",
      locked_desc: "To maintain marketplace quality and prevent spam, pricing and seller contact details are gated.",
      unlock_btn: "Unlock Now (10 ETB)",
      unlocking: "Unlocking...",
      unlocked_success: "Details Unlocked!"
    },
    offer: {
      btn: "Make an Offer",
      title: "Make an Offer",
      desc: "Propose a price to the seller. Offers must be reasonably close to the asking price.",
      your_offer: "Your Offer Amount (ETB)",
      submit: "Submit Offer",
      sending: "Sending...",
      success: "Offer sent to seller!",
      current_price: "Current Price"
    },
    buy_now: {
      btn: "Buy Now",
      modal_title: "Instant Purchase",
      desc: "Items under 100,000 ETB can be purchased instantly.",
      select_payment: "Select Payment Method",
      pay_telebirr: "Pay with Telebirr",
      pay_chapa: "Pay with Chapa (Card/Bank)",
      waiting_telebirr: "Waiting for Telebirr...",
      waiting_chapa: "Connecting to Chapa Gateway...",
      total_pay: "Total Payment",
      redirect_delivery: "Redirecting to delivery setup..."
    },
    delivery: {
      title: "Delivery Setup",
      subtitle: "Your item is secured! Let's get it to your kitchen.",
      address_label: "Delivery Address",
      city_label: "City / Sub-city",
      phone_label: "Contact Phone",
      instructions_label: "Special Instructions (Gate code, floor number)",
      standard: "Standard Delivery (24-48hrs)",
      express: "Express (Same Day)",
      confirm_btn: "Confirm Delivery",
      success_msg: "Delivery Scheduled! Drivers are on the way."
    },
    footer: {
      ad_title: "Got Idle Equipment?",
      ad_subtitle: "Turn your unused kitchen assets into cash. Join 500+ sellers in Addis Ababa.",
      ad_cta: "Start Selling Now",
      newsletter_title: "Stay in the Loop",
      newsletter_desc: "Get the latest deals on industrial ovens and mixers.",
      subscribe: "Subscribe",
      rights: "All Rights Reserved."
    },
    receipt: {
      title: "Reservation Receipt",
      subtitle: "Please present this digital receipt at the Resca Hub.",
      download: "Download PDF",
      trans_id: "Transaction ID",
      date: "Date",
      buyer: "Buyer",
      amount_paid: "Amount Paid",
      remaining: "Remaining Balance",
      item: "Item Reserved",
      instructions: "Instructions",
      step1: "Visit the specified location within 48 hours.",
      step2: "Inspect the equipment personally.",
      step3: "Pay the remaining balance to the seller."
    },
    common: {
      search_placeholder: "Search equipment (e.g., 'Espresso Machine', 'Mitad')...",
      loading: "Loading..."
    }
  },
  am: {
    nav: {
      marketplace: "ገበያ",
      shops: "አቅራቢዎች",
      login: "ግባ",
      register: "ተመዝገብ",
      dashboard: "ዳሽቦርድ"
    },
    hero: {
      tagline: "ለኢትዮጵያ ወጥ ቤቶች የተፈጠረ ዓለም",
      title_start: "የንግድ ኢምፓየርዎን",
      title_end: "ይገንቡ",
      subtitle: "ለሆቴል፣ ሬስቶራንት እና ካፌ ባለሙያዎች የተዘጋጀ የመጀመሪያው የገበያ ስፍራ። በ10% ቅድመ ክፍያ ብቻ ዕቃዎችን ያስይዙ።",
      cta_browse: "ዕቃዎችን ይጎብኙ",
      cta_sell: "ዕቃ ለመሸጥ",
      verified: "የተረጋገጡ ሻጮች",
      fayda: "ፋይዳ የተሳሰረ",
      phase3: "3-Phase የተሞከረ"
    },
    auth: {
      welcome: "እንኳን ወደ ሬስካ በደህና መጡ",
      welcome_back: "እንኳን ደህና መጡ",
      create_account: "መለያ ይፍጠሩ",
      phone_subtitle: "ወደ ኩሽና ንግሥት ለመግባት ስልክ ቁጥርዎን ያስገቡ።",
      phone_label: "ስልክ ቁጥር",
      send_code: "ኮድ ላክ",
      verify_phone: "ስልክ ያረጋግጡ",
      enter_code: "ለዚህ ቁጥር የተላከውን ኮድ ያስገቡ",
      verify_btn: "አረጋግጥ",
      resend: "እንደገና ላክ",
      identity_check: "ማንነት ማረጋገጫ",
      fayda_label: "የፋይዳ መታወቂያ ቁጥር",
      fayda_desc: "ደህንነቱ የተጠበቀ ገበያ ለማረጋገጥ፣ ሬስካ ትክክለኛ የፋይዳ መታወቂያ ይፈልጋል። መረጃዎ የተጠበቀ ነው።",
      verify_id: "ማንነትን አረጋግጥ",
      boost_trust: "ታማኝነትን ይጨምሩ",
      connect_tele: "ቴሌብርን ያገናኙ",
      tele_desc: "\"የተረጋገጠ ከፋይ\" ባጅ ያግኙ እና የ10% ክፍያዎችን በቀላሉ ይፈጽሙ።",
      link_account: "መለያ አገናኝ",
      skip: "ለጊዜው ይለፉ",
      logging_in: "በመግባት ላይ...",
      terms: "ሬስካን ሲጠቀሙ በአገልግሎት ውል እና ግላዊነት ፖሊሲ ይስማማሉ።"
    },
    compare: {
      dock_title: "ዕቃዎችን ያወዳድሩ",
      compare_now: "አሁን ያወዳድሩ",
      clear_all: "ሁሉንም አጽዳ",
      add_to_compare: "ወደ ማወዳደሪያ ጨምር",
      remove: "አስወግድ",
      vs: "ከ...ጋር",
      specs: "ዝርዝር መግለጫ",
      price_breakdown: "የዋጋ ዝርዝር",
      technical_specs: "ቴክኒካዊ መረጃ",
      empty_dock: "ለማወዳደር ዕቃ ይምረጡ"
    },
    unlock: {
      pay_to_view: "ዋጋ ለማየት ይክፈሉ",
      unlock_price: "ዋጋ እና መረጃ ይክፈቱ",
      unlock_fee: "10 ብር የአገልግሎት ክፍያ",
      locked_desc: "የገበያውን ጥራት ለመጠበቅ፣ የዋጋ እና የሻጭ መረጃ ለተከፈለባቸው ተጠቃሚዎች ብቻ ክፍት ነው።",
      unlock_btn: "አሁን ይክፈቱ (10 ብር)",
      unlocking: "በመክፈት ላይ...",
      unlocked_success: "መረጃው ተከፍቷል!"
    },
    offer: {
      btn: "ዋጋ ይስጡ",
      title: "የራስዎን ዋጋ ያቅርቡ",
      desc: "ለሻጩ የሚስማማዎትን ዋጋ ያቅርቡ። ከተስማሙ ማስያዣውን እንዲከፍሉ ይነገርዎታል።",
      your_offer: "የእርስዎ ዋጋ (ብር)",
      submit: "ላክ",
      sending: "በመላክ ላይ...",
      success: "ዋጋዎ ለሻጩ ተልኳል!",
      current_price: "የአሁን ዋጋ"
    },
    buy_now: {
      btn: "አሁን ይግዙ",
      modal_title: "ፈጣን ግዢ",
      desc: "ከ100,000 ብር በታች የሆኑ ዕቃዎችን ወዲያውኑ መግዛት ይችላሉ።",
      select_payment: "የክፍያ ዘዴ ይምረጡ",
      pay_telebirr: "በቴሌብር ይክፈሉ",
      pay_chapa: "በቻፓ ይክፈሉ (ባንክ/ካርድ)",
      waiting_telebirr: "ቴሌብርን በመጠበቅ ላይ...",
      waiting_chapa: "ወደ ቻፓ በመሄድ ላይ...",
      total_pay: "ጠቅላላ ክፍያ",
      redirect_delivery: "ወደ ዴሊቨሪ ማስተካከያ በመሄድ ላይ..."
    },
    delivery: {
      title: "ዴሊቨሪ ማስተካከያ",
      subtitle: "ግዢዎ ተረጋግጧል! አሁን መድረሻ ቦታ ይምረጡ።",
      address_label: "የመድረሻ አድራሻ",
      city_label: "ከተማ / ክፍለ ከተማ",
      phone_label: "ስልክ ቁጥር",
      instructions_label: "ልዩ መመሪያዎች (የቤት ቁጥር፣ ፎቅ)",
      standard: "መደበኛ ዴሊቨሪ (24-48 ሰዓት)",
      express: "ፈጣን (በተመሳሳይ ቀን)",
      confirm_btn: "ዴሊቨሪ አረጋግጥ",
      success_msg: "ዴሊቨሪ ተይዟል! አሽከርካሪዎች በመንገድ ላይ ናቸው።"
    },
    footer: {
      ad_title: "ያልተጠቀሙበት ዕቃ አለዎት?",
      ad_subtitle: "የማይጠቀሙበትን የወጥ ቤት ዕቃ ወደ ገንዘብ ይቀይሩ። አዲስ አበባ ውስጥ ከሚገኙ 500+ ሻጮች ጋር ይቀላቀሉ።",
      ad_cta: "መሸጥ ይጀምሩ",
      newsletter_title: "መረጃ አያምልጥዎ",
      newsletter_desc: "ስለ ኢንዱስትሪያል ምድጃዎች እና ማቀላቀያዎች አዳዲስ ቅናሾችን ያግኙ።",
      subscribe: "ይመዝገቡ",
      rights: "መብቱ በህግ የተጠበቀ ነው።"
    },
    receipt: {
      title: "የክፍያ ደረሰኝ",
      subtitle: "እባክዎን ይህንን ዲጂታል ደረሰኝ በሬስካ ማዕከል ያቅርቡ።",
      download: "PDF አውርድ",
      trans_id: "የግብይት መለያ",
      date: "ቀን",
      buyer: "ገዢ",
      amount_paid: "የተከፈለ",
      remaining: "ቀሪ ክፍያ",
      item: "የተያዘው ዕቃ",
      instructions: "መመሪያዎች",
      step1: "በ48 ሰዓታት ውስጥ ወደ ተጠቀሰው ቦታ ይሂዱ።",
      step2: "ዕቃውን በግል ይመልከቱ።",
      step3: "ቀሪውን ክፍያ ለሻጩ ይክፈሉ።"
    },
    common: {
      search_placeholder: "ዕቃዎችን ይፈልጉ (ምሳሌ፡ 'ኤስፕሬሶ ማሽን'፣ 'ምጣድ')...",
      loading: "በመጫን ላይ..."
    }
  },
  ar: {
    nav: {
      marketplace: "السوق",
      shops: "الموردين",
      login: "تسجيل الدخول",
      register: "تسجيل",
      dashboard: "لوحة التحكم"
    },
    hero: {
      tagline: "العالم للمطابخ الإثيوبية",
      title_start: "جهّز",
      title_end: "إمبراطوريتك",
      subtitle: "السوق الشامل الأول لمحترفي الفنادق والمطاعم في إثيوبيا. احجز معدات ممتازة بدفعة أولى 10% فقط.",
      cta_browse: "تصفح المعدات",
      cta_sell: "بيع المعدات",
      verified: "بائعون موثوقون",
      fayda: "تكامل مع فايدا",
      phase3: "تم اختبار 3 فاز"
    },
    auth: {
      welcome: "مرحبًا بكم في ريسكا",
      welcome_back: "مرحبًا بعودتك",
      create_account: "إنشاء حساب",
      phone_subtitle: "أدخل رقم هاتفك للوصول إلى ملكة المطبخ.",
      phone_label: "رقم الهاتف",
      send_code: "أرسل الرمز",
      verify_phone: "تحقق من الهاتف",
      enter_code: "أدخل الرمز المرسل إلى",
      verify_btn: "تحقق",
      resend: "إعادة إرسال",
      identity_check: "التحقق من الهوية",
      fayda_label: "رقم هوية فايدا",
      fayda_desc: "لضمان سوق آمن، تتطلب ريسكا هوية فايدا صالحة. بياناتك مشفرة.",
      verify_id: "التحقق من الهوية",
      boost_trust: "تعزيز الثقة",
      connect_tele: "ربط تيليبير",
      tele_desc: "احصل على شارة \"دافع موثوق\" وقم بتفعيل ودائع الـ 10% بنقرة واحدة.",
      link_account: "ربط الحساب",
      skip: "تخطى الآن",
      logging_in: "جاري تسجيل الدخول...",
      terms: "من خلال الوصول إلى ريسكا، فإنك توافق على شروط الخدمة وسياسة الخصوصية."
    },
    compare: {
      dock_title: "مقارنة العناصر",
      compare_now: "قارن الآن",
      clear_all: "مسح الكل",
      add_to_compare: "أضف للمقارنة",
      remove: "إزالة",
      vs: "ضد",
      specs: "المواصفات",
      price_breakdown: "تفاصيل السعر",
      technical_specs: "المواصفات الفنية",
      empty_dock: "حدد عناصر للمقارنة"
    },
    unlock: {
      pay_to_view: "ادفع للعرض",
      unlock_price: "فتح السعر والمعلومات",
      unlock_fee: "10 بر رسوم الوصول",
      locked_desc: "للحفاظ على جودة السوق، يتم حجب تفاصيل الأسعار والاتصال.",
      unlock_btn: "فتح الآن (10 بر)",
      unlocking: "جاري الفتح...",
      unlocked_success: "تم فتح التفاصيل!"
    },
    offer: {
      btn: "قدم عرضًا",
      title: "قدم عرضًا",
      desc: "اقترح سعرًا للبائع. في حالة القبول، سيتم إخطارك لمتابعة الحجز.",
      your_offer: "مبلغ العرض (بر)",
      submit: "إرسال العرض",
      sending: "جاري الإرسال...",
      success: "تم إرسال العرض للبائع!",
      current_price: "السعر الحالي"
    },
    buy_now: {
      btn: "شراء الآن",
      modal_title: "شراء فوري",
      desc: "يمكن شراء العناصر التي تقل قيمتها عن 100,000 بر فورًا.",
      select_payment: "اختر طريقة الدفع",
      pay_telebirr: "ادفع عبر تيليبير",
      pay_chapa: "ادفع عبر شابا (بطاقة/بنك)",
      waiting_telebirr: "في انتظار تيليبير...",
      waiting_chapa: "الاتصال ببوابة شابا...",
      total_pay: "إجمالي الدفع",
      redirect_delivery: "إعادة التوجيه لإعداد التسليم..."
    },
    delivery: {
      title: "إعداد التسليم",
      subtitle: "تم تأمين البند الخاص بك! دعنا نرسله إلى مطبخك.",
      address_label: "عنوان التسليم",
      city_label: "المدينة / الحي",
      phone_label: "هاتف الاتصال",
      instructions_label: "تعليمات خاصة (رمز البوابة، رقم الطابق)",
      standard: "تسليم قياسي (24-48 ساعة)",
      express: "سريع (في نفس اليوم)",
      confirm_btn: "تأكيد التسليم",
      success_msg: "تمت جدولة التسليم! السائقون في الطريق."
    },
    footer: {
      ad_title: "هل لديك معدات غير مستخدمة؟",
      ad_subtitle: "حوّل أصول مطبخك غير المستخدمة إلى نقد. انضم إلى أكثر من 500 بائع في أديس أبابا.",
      ad_cta: "ابدأ البيع الآن",
      newsletter_title: "ابق على اطلاع",
      newsletter_desc: "احصل على أحدث العروض على الأفران الصناعية والخلاطات.",
      subscribe: "اشترك",
      rights: "جميع الحقوق محفوظة."
    },
    receipt: {
      title: "إيصال الحجز",
      subtitle: "يرجى تقديم هذا الإيصال الرقمي في مركز ريسكا.",
      download: "تحميل PDF",
      trans_id: "رقم المعاملة",
      date: "التاريخ",
      buyer: "المشتري",
      amount_paid: "المبلغ المدفوع",
      remaining: "الرصيد المتبقي",
      item: "العنصر المحجوز",
      instructions: "تعليمات",
      step1: "قم بزيارة الموقع المحدد خلال 48 ساعة.",
      step2: "فحص المعدات شخصيا.",
      step3: "ادفع الرصيد المتبقي للبائع."
    },
    common: {
      search_placeholder: "ابحث عن المعدات (مثال: 'آلة إسبرسو'، 'ميتاد')...",
      loading: "جار التحميل..."
    }
  }
};