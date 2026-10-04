# Order flow (WhatsApp)

This is the feature the whole concept exists to sell. Read it before touching
anything in `src/lib/cart.ts`, `src/lib/whatsapp.ts`, or the cart components.

## 1. Principles

- **No backend, no payment, no account.** The order is a message, not a checkout.
- **Enquiry only.** The total shown is indicative; the owner confirms price,
  availability and delivery in the chat.
- **No delivery fees** are calculated or shown.
- **Mobile-first.** Assume the visitor is on a phone, arriving from a Facebook or
  WhatsApp link.
- **Never lose the order.** The cart survives a page reload (`localStorage`) and the
  WhatsApp link contains the full order, so even if the tab closes nothing is lost.

## 2. The flow

```text
Browse menu
   │  tap "Add"
   ▼
Cart (localStorage)  ◀── adjust quantities / remove
   │  "Review order"
   ▼
Order step
   ├─ Pickup or Delivery  (radio, per site.order flags)
   ├─ Name (required)
   ├─ Phone (required)
   └─ Notes (optional)
   │  "Send order on WhatsApp"
   ▼
wa.me/<owner-number>?text=<url-encoded itemized message>
   │
   ▼
Owner's WhatsApp chat opens with the order pre-filled.
```

## 3. Message format

Built by `src/lib/whatsapp.ts`. Keep it plain text, unambiguous on a phone, and
localized where it does not confuse the owner.

```text
New order from Crumb & Co. website

*Items*
1. Love Cake x2 — Rs. 3,600
2. Milk Rice x1 — Rs. 120

*Total (indicative)*: Rs. 3,720

*Type*: Delivery
*Name*: Nimal Perera
*Phone*: +94 71 234 5678
*Address*: 24 Temple Lane, Nugegoda
*Notes*: Ready around 6pm please.
```

- Use `*bold*` (WhatsApp markdown) for section headers.
- Item lines: quantity, name, line total.
- State clearly that the total is indicative and the owner will confirm.
- The `Address` line is included only for delivery orders.
- Numbers encoded with `encodeURIComponent`; `\n` becomes `%0A`.
- Do not use the `+` in the number; `wa.me` expects digits with country code
  (`94771234567`).

## 4. Cart rules

- Item identity is the product `id`; the cart stores only `{ id, qty }`.
- Quantities are positive integers; removing the last unit removes the line.
- Item details (name, price) are resolved from the current menu data at render and
  message-build time, so a stale cart cannot hold an old price.
- Empty cart: the send button is disabled and the user is told to add something.
- Unavailable items (`available: false` from the Sheet) cannot be added and are
  shown as "sold out"; if an item in the cart becomes unavailable, warn the user
  before sending.

## 5. Pickup vs delivery

- Both are on/off via `site.order.allowPickup` / `allowDelivery`. If only one is
  enabled, pre-select it and do not show a choice.
- The choice is written into the message as `Pickup` or `Delivery` (localized
  label).
- **Delivery requires an address.** The address field is hidden for pickup and
  shown + required for delivery, and its value is added to the message. There is
  still no delivery fee — the owner confirms that in chat.

## 6. Configuration

- Owner WhatsApp number: `site.whatsappNumber` in `src/data/site.ts`.
- Message template and labels: `src/i18n/ui.ts` (all three languages).
- Feature flags: `site.order`.

## 7. Verification (smoke test)

After any change to the flow, manually verify on a phone-sized viewport:

1. Add two different items with different quantities.
2. Adjust and remove quantities; the count shows the number of distinct products
   (one product with quantity 2 counts as one item), and the total is correct.
3. Reload the page — cart persists.
4. Choose pickup: no address field. Choose delivery: the address field appears and
   is required, and the message includes it.
5. Fill name/phone (and address for delivery); omit notes.
6. Tap send; WhatsApp opens with a correctly itemized, correctly encoded message,
   to the configured number, in the selected language.
7. Mark an item unavailable in the Sheet; confirm it cannot be added.

If a Playwright smoke test is added later, automate steps 1–6 and document it in
`AGENTS.md`.
