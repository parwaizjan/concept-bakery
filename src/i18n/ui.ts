/**
 * All user-facing UI strings, in all supported languages.
 *
 * Every new string MUST exist in `en`, `si` and `ta`. Do not hardcode English copy
 * into components — add a key here instead. Missing `si`/`ta` values fall back to
 * `en` at runtime (see `utils.ts`).
 */

import type { Locale } from "../data/site";

export const languages = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்",
} as const;

export const defaultLang: Locale = "en";

const en = {
  "a11y.skip": "Skip to content",

  "nav.home": "Home",
  "nav.menu": "Menu",
  "nav.about": "About",
  "nav.gallery": "Gallery",
  "nav.visit": "Visit us",

  "common.viewMenu": "View menu",
  "common.orderOnWhatsApp": "Order on WhatsApp",
  "common.chatOnWhatsApp": "Chat on WhatsApp",
  "common.close": "Close",
  "common.remove": "Remove",
  "common.optional": "optional",
  "common.openMenu": "Open menu",
  "common.language": "Language",

  "hero.eyebrow": "Fresh bakery",
  "hero.cta": "View menu",
  "hero.secondary": "Chat on WhatsApp",

  "menu.title": "Our menu",
  "menu.subtitle": "Tap an item to add it to your order.",
  "menu.all": "All",
  "menu.soldOut": "Sold out",
  "menu.add": "Add",
  "menu.added": "Added",
  "menu.available": "Available",
  "menu.empty": "Our menu is being updated. Please check back soon.",
  "menu.filter": "Filter by category",

  "bestsellers.title": "Bakery favourites",

  "about.title": "Our story",
  "about.teaser":
    "We bake fresh every morning using recipes handed down through the family.",
  "about.imageAlt":
    "Freshly baked bread and short eats on display in the bakery",
  "about.readMore": "Read more",

  "gallery.title": "From our bakery",
  "gallery.altShortEats":
    "A plate of Sri Lankan bakery short eats — fish buns, egg rolls, cutlets and sausage rolls",
  "gallery.altSweets":
    "Sri Lankan bakery sweets — crispy kokis, jaggery aluwa, cashew milk toffee and kalu dodol",
  "gallery.altCakes":
    "Sri Lankan bakery cakes — love cake, butter cake and chocolate cake with a cup of tea",
  "gallery.altBread":
    "Freshly baked Sri Lankan kade bread — white loaves, sliced bread and rolls",
  "gallery.altDrinks":
    "Sri Lankan bakery drinks — rose faluda with ice cream and a glass of plain Ceylon tea",
  "gallery.altMilkRice":
    "Sri Lankan kiribath (milk rice) cut into diamonds, served with lunu miris",

  "visit.title": "Visit us",
  "visit.address": "Address",
  "visit.hours": "Opening hours",
  "visit.phone": "Phone",
  "visit.whatsapp": "WhatsApp",
  "visit.map": "Find us",
  "visit.directions": "Get directions",
  "visit.openNow": "Open now",
  "visit.closedNow": "Closed now",
  "visit.today": "Today",

  "cart.title": "Your order",
  "cart.empty": "Your cart is empty",
  "cart.emptyHint": "Add items from the menu to start an order.",
  "cart.viewOrder": "View order",
  "cart.subtotal": "Subtotal",
  "cart.total": "Total",
  "cart.indicative":
    "Indicative total — the bakery confirms the final amount on WhatsApp.",
  "cart.quantity": "Quantity",
  "cart.decrease": "Decrease quantity",
  "cart.increase": "Increase quantity",
  "cart.items": "items",
  "cart.item": "item",

  "order.title": "Almost done",
  "order.pickup": "Pickup",
  "order.delivery": "Delivery",
  "order.name": "Your name",
  "order.namePlaceholder": "e.g. Nimal Perera",
  "order.phone": "Phone number",
  "order.phonePlaceholder": "e.g. 071 234 5678",
  "order.notes": "Notes",
  "order.notesPlaceholder": "Any special requests or a preferred time?",
  "order.address": "Delivery address",
  "order.addressPlaceholder": "House number, street, area",
  "order.send": "Send order on WhatsApp",
  "order.cartEmpty": "Add at least one item before sending.",
  "order.noFees":
    "No payment online. You will confirm everything with the bakery on WhatsApp.",

  "msg.intro": "Hello! I would like to place an order:",
  "msg.items": "Items",
  "msg.total": "Total (indicative)",
  "msg.type": "Type",
  "msg.name": "Name",
  "msg.phone": "Phone",
  "msg.address": "Address",
  "msg.notes": "Notes",
  "msg.footer": "Please confirm availability and the final total. Thank you!",

  "footer.orderNote": "Orders are taken on WhatsApp.",
  "footer.rights": "All rights reserved.",

  "notFound.title": "Page not found",
  "notFound.body": "Sorry, we could not find that page.",
  "notFound.cta": "Back to menu",
};

const si: typeof en = {
  "a11y.skip": "අන්තර්ගතයට යන්න",

  "nav.home": "මුල් පිටුව",
  "nav.menu": "මෙනුව",
  "nav.about": "අපි ගැන",
  "nav.gallery": "ඡායාරූප",
  "nav.visit": "අප අමතන්න",

  "common.viewMenu": "මෙනුව බලන්න",
  "common.orderOnWhatsApp": "WhatsApp හරහා ඇණවුම් කරන්න",
  "common.chatOnWhatsApp": "WhatsApp හරහා කතා කරන්න",
  "common.close": "වසන්න",
  "common.remove": "ඉවත් කරන්න",
  "common.optional": "විකල්ප",
  "common.openMenu": "මෙනුව විවෘත කරන්න",
  "common.language": "භාෂාව",

  "hero.eyebrow": "නැවුම් බේකරිය",
  "hero.cta": "මෙනුව බලන්න",
  "hero.secondary": "WhatsApp හරහා කතා කරන්න",

  "menu.title": "අපගේ මෙනුව",
  "menu.subtitle": "ඇණවුමට එකතු කිරීමට අයිතමයක් තට්ටු කරන්න.",
  "menu.all": "සියල්ල",
  "menu.soldOut": "අවසන්",
  "menu.add": "එකතු කරන්න",
  "menu.added": "එකතු කර ඇත",
  "menu.available": "තිබේ",
  "menu.empty": "අපගේ මෙනුව යාවත්කාලීන වෙමින් පවතී. නැවත පරීක්ෂා කරන්න.",
  "menu.filter": "ප්‍රවර්ගය අනුව පෙරන්න",

  "bestsellers.title": "ජනප්‍රියම",

  "about.title": "අපගේ කතාව",
  "about.teaser":
    "අපි සෑම උදෑසනකම පවුලේ පරම්පරාවෙන් ලැබුණු වට්ටෝරු භාවිතයෙන් නැවුම් ලෙස පිළිස්සෙමු.",
  "about.imageAlt": "බේකරියේ ප්‍රදර්ශනය කර ඇති නැවුම් පාන් සහ ෂෝර්ට් ඊට්ස්",
  "about.readMore": "තව කියවන්න",

  "gallery.title": "අපගේ බේකරියෙන්",
  "gallery.altShortEats":
    "ශ්‍රී ලංකා බේකරි ෂෝර්ට් ඊට්ස් තැටියක් — මාළු බනිස්, බිත්තර රෝල්, කට්ලට් සහ සොසේජ් රෝල්",
  "gallery.altSweets":
    "ශ්‍රී ලංකා බේකරි පැණි රස — හැපි කොකිස්, අලුවා, කජු මිල්ක් ටොෆි සහ කලු දොදොල්",
  "gallery.altCakes":
    "ශ්‍රී ලංකා බේකරි කේක් — ලව් කේක්, බටර් කේක් සහ චොකලට් කේක්, තේ කෝප්පයක් සමඟ",
  "gallery.altBread":
    "නැවුම් ලෙස පිළිස්සූ ශ්‍රී ලංකා කඩේ පාන් — සුදු පාන්, කැපූ පාන් සහ රෝල්",
  "gallery.altDrinks":
    "ශ්‍රී ලංකා බේකරි පාන — අයිස් ක්‍රීම් සහිත රෝස් ෆලූඩා සහ ප්ලේන් ලංකා තේ වීදුරුවක්",
  "gallery.altMilkRice":
    "ලුනු මිරිස් සමඟ පිළිගැන්වූ දියමන්ති හැඩැති ශ්‍රී ලාංකික කිරිබත්",

  "visit.title": "අප අමතන්න",
  "visit.address": "ලිපිනය",
  "visit.hours": "විවෘත වේලාවන්",
  "visit.phone": "දුරකථන",
  "visit.whatsapp": "WhatsApp",
  "visit.map": "අප සොයා ගන්න",
  "visit.directions": "මාර්ග උපදෙස්",
  "visit.openNow": "දැන් විවෘතයි",
  "visit.closedNow": "දැන් වසා ඇත",
  "visit.today": "අද",

  "cart.title": "ඔබේ ඇණවුම",
  "cart.empty": "ඔබේ කරත්තය හිස්ය",
  "cart.emptyHint": "ඇණවුමක් ආරම්භ කිරීමට මෙනුවෙන් අයිතම එකතු කරන්න.",
  "cart.viewOrder": "ඇණවුම බලන්න",
  "cart.subtotal": "උප එකතුව",
  "cart.total": "මුළු එකතුව",
  "cart.indicative":
    "මෙය ඇස්තමේන්තුගත මුළු එකතුවකි — අවසන් මුදල බේකරිය WhatsApp හරහා තහවුරු කරයි.",
  "cart.quantity": "ප්‍රමාණය",
  "cart.decrease": "ප්‍රමාණය අඩු කරන්න",
  "cart.increase": "ප්‍රමාණය වැඩි කරන්න",
  "cart.items": "අයිතම",
  "cart.item": "අයිතමය",

  "order.title": "තව ටිකයි",
  "order.pickup": "පිකප්",
  "order.delivery": "බෙදාහැරීම",
  "order.name": "ඔබේ නම",
  "order.namePlaceholder": "උදා: නිමල් පෙරේරා",
  "order.phone": "දුරකථන අංකය",
  "order.phonePlaceholder": "උදා: 071 234 5678",
  "order.notes": "සටහන්",
  "order.notesPlaceholder": "විශේෂ ඉල්ලීම් හෝ කැමති වේලාවක්?",
  "order.address": "බෙදාහැරීමේ ලිපිනය",
  "order.addressPlaceholder": "නිවසේ අංකය, පාර, ප්‍රදේශය",
  "order.send": "WhatsApp හරහා ඇණවුම යවන්න",
  "order.cartEmpty": "යැවීමට පෙර අවම වශයෙන් එක් අයිතමයක් එකතු කරන්න.",
  "order.noFees":
    "මාර්ගගතව ගෙවීමක් නැත. සියල්ල WhatsApp හරහා බේකරිය සමඟ තහවුරු කරන්න.",

  "msg.intro": "ආයුබෝවන්! මට ඇණවුමක් කිරීමට අවශ්‍යයි:",
  "msg.items": "අයිතම",
  "msg.total": "මුළු එකතුව (ඇස්තමේන්තුගත)",
  "msg.type": "වර්ගය",
  "msg.name": "නම",
  "msg.phone": "දුරකථන",
  "msg.address": "ලිපිනය",
  "msg.notes": "සටහන්",
  "msg.footer":
    "ලබා ගැනීමේ හැකියාව සහ අවසන් මුළු එකතුව තහවුරු කරන්න. ස්තූතියි!",

  "footer.orderNote": "ඇණවුම් WhatsApp හරහා ලබා ගනී.",
  "footer.rights": "සියලුම හිමිකම් ඇවිරිණි.",

  "notFound.title": "පිටුව හමු නොවිණි",
  "notFound.body": "සමාවන්න, අපට එම පිටුව සොයාගත නොහැකි විය.",
  "notFound.cta": "මෙනුවට ආපසු",
};

const ta: typeof en = {
  "a11y.skip": "உள்ளடக்கத்திற்குச் செல்",

  "nav.home": "முகப்பு",
  "nav.menu": "மெனு",
  "nav.about": "எங்களைப் பற்றி",
  "nav.gallery": "படங்கள்",
  "nav.visit": "எங்களை அணுகவும்",

  "common.viewMenu": "மெனுவைப் பார்க்க",
  "common.orderOnWhatsApp": "WhatsApp மூலம் ஆர்டர் செய்ய",
  "common.chatOnWhatsApp": "WhatsApp-இல் அரட்டை",
  "common.close": "மூடு",
  "common.remove": "நீக்கு",
  "common.optional": "விருப்பம்",
  "common.openMenu": "மெனுவைத் திற",
  "common.language": "மொழி",

  "hero.eyebrow": "புதிய பேக்கரி",
  "hero.cta": "மெனுவைப் பார்க்க",
  "hero.secondary": "WhatsApp-இல் அரட்டை",

  "menu.title": "எங்கள் மெனு",
  "menu.subtitle": "ஆர்டரில் சேர்க்க ஒரு பொருளைத் தட்டவும்.",
  "menu.all": "அனைத்தும்",
  "menu.soldOut": "முடிந்தது",
  "menu.add": "சேர்",
  "menu.added": "சேர்க்கப்பட்டது",
  "menu.available": "கிடைக்கும்",
  "menu.empty":
    "எங்கள் மெனு புதுப்பிக்கப்படுகிறது. பின்னர் மீண்டும் பாருங்கள்.",
  "menu.filter": "வகைப்படி வடிகட்டு",

  "bestsellers.title": "விருப்பமானவை",

  "about.title": "எங்கள் கதை",
  "about.teaser":
    "குடும்பப் பாரம்பரிய சமையல் குறிப்புகளுடன் ஒவ்வொரு காலையும் புதிதாக சுடுகிறோம்.",
  "about.imageAlt":
    "பேக்கரியில் காட்சிக்கு வைக்கப்பட்டுள்ள புதிய ரொட்டி மற்றும் ஸ்நாக்ஸ்",
  "about.readMore": "மேலும் படிக்க",

  "gallery.title": "எங்கள் பேக்கரியிலிருந்து",
  "gallery.altShortEats":
    "இலங்கை பேக்கரி ஸ்நாக்ஸ் தட்டு — மீன் பன், முட்டை ரோல், கட்லெட் மற்றும் சாசேஜ் ரோல்",
  "gallery.altSweets":
    "இலங்கை பேக்கரி இனிப்புகள் — மொறுமொறுப்பான கொக்கிஸ், அலுவா, முந்திரி மில்க் டாஃபி மற்றும் களு தோதல்",
  "gallery.altCakes":
    "இலங்கை பேக்கரி கேக்குகள் — லவ் கேக், வெண்ணெய் கேக் மற்றும் சாக்லேட் கேக், தேநீருடன்",
  "gallery.altBread":
    "புதிதாக சுடப்பட்ட இலங்கை கடை ரொட்டி — வெள்ளை ரொட்டி, வெட்டிய ரொட்டி மற்றும் ரோல்",
  "gallery.altDrinks":
    "இலங்கை பேக்கரி பானங்கள் — ஐஸ்கிரீம் சேர்ந்த ரோஸ் ஃபலூடா மற்றும் ஒரு கிளாஸ் சாதா இலங்கை தேநீர்",
  "gallery.altMilkRice":
    "லுனு மிரிஸுடன் பரிமாறப்பட்ட வைர வடிவில் வெட்டப்பட்ட இலங்கை கிரிபத் (பால் சோறு)",

  "visit.title": "எங்களை அணுகவும்",
  "visit.address": "முகவரி",
  "visit.hours": "திறந்திருக்கும் நேரம்",
  "visit.phone": "தொலைபேசி",
  "visit.whatsapp": "WhatsApp",
  "visit.map": "எங்களைக் கண்டறிய",
  "visit.directions": "வழிகாட்டி",
  "visit.openNow": "இப்போது திறந்துள்ளது",
  "visit.closedNow": "இப்போது மூடப்பட்டுள்ளது",
  "visit.today": "இன்று",

  "cart.title": "உங்கள் ஆர்டர்",
  "cart.empty": "உங்கள் கார்ட் காலியாக உள்ளது",
  "cart.emptyHint": "ஆர்டரைத் தொடங்க மெனுவிலிருந்து பொருட்களைச் சேர்க்கவும்.",
  "cart.viewOrder": "ஆர்டரைப் பார்க்க",
  "cart.subtotal": "கூட்டுத்தொகை",
  "cart.total": "மொத்தம்",
  "cart.indicative":
    "இது தோராயமான மொத்தம் — இறுதித் தொகையை பேக்கரி WhatsApp-இல் உறுதிப்படுத்தும்.",
  "cart.quantity": "அளவு",
  "cart.decrease": "அளவைக் குறை",
  "cart.increase": "அளவை அதிகரி",
  "cart.items": "பொருட்கள்",
  "cart.item": "பொருள்",

  "order.title": "இன்னும் கொஞ்சம்",
  "order.pickup": "எடுத்துச் செல்",
  "order.delivery": "விநியோகம்",
  "order.name": "உங்கள் பெயர்",
  "order.namePlaceholder": "உ.ம். நிமல் பெரேரா",
  "order.phone": "தொலைபேசி எண்",
  "order.phonePlaceholder": "உ.ம். 071 234 5678",
  "order.notes": "குறிப்புகள்",
  "order.notesPlaceholder": "சிறப்பு கோரிக்கைகள் அல்லது விருப்ப நேரம்?",
  "order.address": "விநியோக முகவரி",
  "order.addressPlaceholder": "வீட்டு எண், தெரு, பகுதி",
  "order.send": "WhatsApp-இல் ஆர்டரை அனுப்பு",
  "order.cartEmpty": "அனுப்புவதற்கு முன் குறைந்தது ஒரு பொருளைச் சேர்க்கவும்.",
  "order.noFees":
    "ஆன்லைன் பணம் இல்லை. எல்லாவற்றையும் WhatsApp-இல் பேக்கரியுடன் உறுதிப்படுத்துவீர்கள்.",

  "msg.intro": "வணக்கம்! நான் ஒரு ஆர்டர் செய்ய விரும்புகிறேன்:",
  "msg.items": "பொருட்கள்",
  "msg.total": "மொத்தம் (தோராயமான)",
  "msg.type": "வகை",
  "msg.name": "பெயர்",
  "msg.phone": "தொலைபேசி",
  "msg.address": "முகவரி",
  "msg.notes": "குறிப்புகள்",
  "msg.footer":
    "கிடைக்கும் தன்மையையும் இறுதி மொத்தத்தையும் உறுதிப்படுத்தவும். நன்றி!",

  "footer.orderNote": "ஆர்டர்கள் WhatsApp-இல் எடுக்கப்படும்.",
  "footer.rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",

  "notFound.title": "பக்கம் கிடைக்கவில்லை",
  "notFound.body": "மன்னிக்கவும், அந்தப் பக்கத்தைக் கண்டுபிடிக்க முடியவில்லை.",
  "notFound.cta": "மெனுவுக்குத் திரும்பு",
};

export const ui = { en, si, ta } as const;

export type UiKey = keyof typeof en;
