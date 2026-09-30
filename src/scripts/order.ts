/**
 * Client order engine: cart, Google Sheet merge, and the WhatsApp hand-off.
 *
 * Plain DOM + localStorage, no framework. Runs on every page. All bakery-specific
 * values and UI strings arrive through the `#order-config` JSON block rendered by
 * `BaseLayout`.
 */
import { formatPrice } from "../lib/format";
import { getSheetCsvUrl, parseMenuSheet } from "../lib/sheet";
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  type Fulfillment,
} from "../lib/whatsapp";
import type { UiKey } from "../i18n/ui";

type OrderConfig = {
  whatsappNumber: string;
  siteName: string;
  lang: string;
  i18n: Record<UiKey, string>;
  menu: {
    mode: "runtime" | "build";
    sheetId: string;
    sheetTab: string;
    refreshMinutes: number;
  };
};

type CartState = Record<string, number>;

type Item = {
  id: string;
  name: string;
  price: number;
  available: boolean;
  category: string;
};

const STORAGE_KEY = "crumb-cart-v1";
const CACHE_KEY = "crumb-sheet-v1";

function readConfig(): OrderConfig | null {
  const node = document.getElementById("order-config");
  if (!node?.textContent) return null;
  try {
    return JSON.parse(node.textContent) as OrderConfig;
  } catch {
    return null;
  }
}

function loadCart(): CartState {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as CartState;
  } catch {
    return {};
  }
}

function saveCart(cart: CartState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* storage unavailable; cart stays in-memory for this page view */
  }
}

class OrderApp {
  private config: OrderConfig;
  private cart: CartState;
  private items = new Map<string, Item>();
  private t: (key: UiKey) => string;

  constructor(config: OrderConfig) {
    this.config = config;
    this.cart = loadCart();
    this.t = (key) => this.config.i18n[key] ?? key;
  }

  init(): void {
    this.collectItems();
    this.bind();
    this.render();
    this.updateOpenNow();
    void this.refreshFromSheet();
  }

  private collectItems(): void {
    document.querySelectorAll<HTMLElement>("[data-product]").forEach((node) => {
      const id = node.dataset.id;
      if (!id) return;
      this.items.set(id, {
        id,
        name: node.dataset.name ?? id,
        price: Number(node.dataset.price ?? 0),
        available: node.dataset.available !== "false",
        category: node.dataset.category ?? "",
      });
    });
  }

  private bind(): void {
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      const add = target.closest<HTMLElement>("[data-add]");
      if (add?.dataset.add) {
        this.changeQty(add.dataset.add, 1);
        return;
      }

      const inc = target.closest<HTMLElement>("[data-qty-increase]");
      if (inc?.dataset.qtyIncrease) {
        this.changeQty(inc.dataset.qtyIncrease, 1);
        return;
      }

      const dec = target.closest<HTMLElement>("[data-qty-decrease]");
      if (dec?.dataset.qtyDecrease) {
        this.changeQty(dec.dataset.qtyDecrease, -1);
        return;
      }

      const remove = target.closest<HTMLElement>("[data-cart-remove]");
      if (remove?.dataset.cartRemove) {
        this.setQty(remove.dataset.cartRemove, 0);
        return;
      }

      if (target.closest("[data-cart-open]")) {
        this.openDrawer();
        return;
      }

      if (target.closest("[data-cart-close]")) {
        this.closeDrawer();
        return;
      }

      const chip = target.closest<HTMLElement>("[data-category-chip]");
      if (chip) {
        this.filterCategory(chip.dataset.categoryChip ?? "all", chip);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") this.closeDrawer();
    });

    const form = document.querySelector<HTMLFormElement>("[data-order-form]");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.sendOrder(form);
    });
    if (form) {
      form.addEventListener("change", (event) => {
        const target = event.target;
        if (
          target instanceof HTMLInputElement &&
          target.name === "fulfillment"
        ) {
          this.updateFulfillment(form);
        }
      });
      this.updateFulfillment(form);
    }
  }

  /** Show/require the address field only when delivery is selected. */
  private updateFulfillment(form: HTMLFormElement): void {
    const isDelivery = new FormData(form).get("fulfillment") === "delivery";
    const field = form.querySelector<HTMLElement>("[data-delivery-field]");
    const input = form.querySelector<HTMLInputElement>('input[name="address"]');
    if (field) field.hidden = !isDelivery;
    if (input) input.required = isDelivery;
  }

  /** Number of distinct products in the cart (what "items" refers to in the UI). */
  private get lineCount(): number {
    return Object.keys(this.cart).length;
  }

  private get total(): number {
    let sum = 0;
    for (const [id, qty] of Object.entries(this.cart)) {
      const item = this.items.get(id);
      if (item) sum += item.price * qty;
    }
    return sum;
  }

  private setQty(id: string, qty: number): void {
    if (qty <= 0) {
      delete this.cart[id];
    } else {
      this.cart[id] = qty;
    }
    saveCart(this.cart);
    this.render();
  }

  private changeQty(id: string, delta: number): void {
    const item = this.items.get(id);
    if (delta > 0 && item && !item.available) return;
    this.setQty(id, (this.cart[id] ?? 0) + delta);
  }

  private render(): void {
    this.renderBadge();
    this.renderSticky();
    this.renderDrawer();
  }

  private renderBadge(): void {
    const count = this.lineCount;
    document
      .querySelectorAll<HTMLElement>("[data-cart-count]")
      .forEach((node) => {
        node.textContent = String(count);
        node.hidden = count === 0;
      });
  }

  private renderSticky(): void {
    const bar = document.querySelector<HTMLElement>("[data-sticky-bar]");
    if (!bar) return;
    const count = this.lineCount;
    bar.hidden = count === 0;
    const countNode = bar.querySelector<HTMLElement>("[data-sticky-count]");
    const totalNode = bar.querySelector<HTMLElement>("[data-sticky-total]");
    if (countNode)
      countNode.textContent = `${count} ${this.t(
        count === 1 ? "cart.item" : "cart.items",
      )}`;
    if (totalNode) totalNode.textContent = formatPrice(this.total);
  }

  private renderDrawer(): void {
    const list = document.querySelector<HTMLElement>("[data-cart-items]");
    const empty = document.querySelector<HTMLElement>("[data-cart-empty]");
    const summary = document.querySelector<HTMLElement>("[data-cart-summary]");
    if (!list) return;

    const entries = Object.entries(this.cart).filter(([id]) =>
      this.items.has(id),
    );

    list.replaceChildren();

    if (empty) empty.hidden = entries.length > 0;
    if (summary) summary.hidden = entries.length === 0;

    for (const [id, qty] of entries) {
      const item = this.items.get(id);
      if (!item) continue;
      list.append(this.renderLine(item, qty));
    }

    const subtotal = document.querySelector<HTMLElement>(
      "[data-cart-subtotal]",
    );
    const total = document.querySelector<HTMLElement>("[data-cart-total]");
    if (subtotal) subtotal.textContent = formatPrice(this.total);
    if (total) total.textContent = formatPrice(this.total);

    const send = document.querySelector<HTMLButtonElement>("[data-send]");
    if (send) send.disabled = entries.length === 0;
  }

  private renderLine(item: Item, qty: number): HTMLElement {
    const line = document.createElement("div");
    line.className =
      "flex items-center gap-3 border-b border-border py-3 last:border-b-0";

    const info = document.createElement("div");
    info.className = "min-w-0 flex-1";

    const name = document.createElement("p");
    name.className = "truncate font-medium";
    name.textContent = item.name;

    const price = document.createElement("p");
    price.className = "text-sm text-text-muted";
    price.textContent = `${formatPrice(item.price)} × ${qty} = ${formatPrice(
      item.price * qty,
    )}`;

    info.append(name);
    if (!item.available) {
      const soldOut = document.createElement("span");
      soldOut.className = "badge mt-1 bg-danger text-white";
      soldOut.textContent = this.t("menu.soldOut");
      info.append(soldOut);
    }
    info.append(price);

    const stepper = document.createElement("div");
    stepper.className = "flex items-center gap-1";

    const dec = document.createElement("button");
    dec.type = "button";
    dec.className = "btn btn-outline h-11 w-11 !p-0";
    dec.dataset.qtyDecrease = item.id;
    dec.setAttribute("aria-label", this.t("cart.decrease"));
    dec.textContent = "−";

    const count = document.createElement("span");
    count.className = "w-8 text-center font-semibold";
    count.textContent = String(qty);

    const inc = document.createElement("button");
    inc.type = "button";
    inc.className = "btn btn-outline h-11 w-11 !p-0";
    inc.dataset.qtyIncrease = item.id;
    inc.setAttribute("aria-label", this.t("cart.increase"));
    inc.textContent = "+";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className =
      "ml-1 text-sm text-text-muted underline hover:text-danger";
    remove.dataset.cartRemove = item.id;
    remove.textContent = this.t("common.remove");

    stepper.append(dec, count, inc);

    line.append(info, stepper, remove);
    return line;
  }

  private openDrawer(): void {
    const drawer = document.querySelector<HTMLElement>("[data-cart-drawer]");
    if (!drawer) return;
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    drawer.querySelector<HTMLElement>("[data-cart-close]")?.focus();
  }

  private closeDrawer(): void {
    const drawer = document.querySelector<HTMLElement>("[data-cart-drawer]");
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    document.body.style.overflow = "";
  }

  private sendOrder(form: HTMLFormElement): void {
    if (this.lineCount === 0) return;

    const data = new FormData(form);
    const fulfillment: Fulfillment =
      data.get("fulfillment") === "delivery" ? "delivery" : "pickup";
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const notes = String(data.get("notes") ?? "").trim();

    if (!name || !phone || (fulfillment === "delivery" && !address)) {
      form.reportValidity();
      return;
    }

    const lines = Object.entries(this.cart)
      .map(([id, qty]) => {
        const item = this.items.get(id);
        return item ? { id, name: item.name, price: item.price, qty } : null;
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);

    const message = buildOrderMessage(
      { lines, total: this.total, fulfillment, name, phone, address, notes },
      this.t,
    );

    window.open(
      buildWhatsAppUrl(message, this.config.whatsappNumber),
      "_blank",
      "noopener,noreferrer",
    );
  }

  private filterCategory(category: string, active: HTMLElement): void {
    document
      .querySelectorAll<HTMLElement>("[data-category-section]")
      .forEach((section) => {
        section.hidden =
          category !== "all" && section.dataset.categorySection !== category;
      });

    document
      .querySelectorAll<HTMLElement>("[data-category-chip]")
      .forEach((chip) => {
        const isActive = chip === active;
        chip.setAttribute("aria-pressed", String(isActive));
        chip.classList.toggle("btn-primary", isActive);
        chip.classList.toggle("btn-outline", !isActive);
      });
  }

  private updateOpenNow(): void {
    const badge = document.querySelector<HTMLElement>("[data-open-badge]");
    if (!badge) return;

    const rows = Array.from(
      document.querySelectorAll<HTMLElement>("[data-hours-day]"),
    );
    if (rows.length === 0) return;

    const now = new Date();
    const today = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const toMinutes = (value: string): number => {
      const [h, m] = value.split(":").map(Number);
      return (h ?? 0) * 60 + (m ?? 0);
    };

    const row = rows.find((r) => Number(r.dataset.hoursDay) === today);
    let open = false;
    if (row?.dataset.hoursOpen && row?.dataset.hoursClose) {
      const start = toMinutes(row.dataset.hoursOpen);
      const end = toMinutes(row.dataset.hoursClose);
      open = minutes >= start && minutes < end;
    }

    badge.textContent = open
      ? this.t("visit.openNow")
      : this.t("visit.closedNow");
    badge.className = `badge ${
      open ? "bg-success text-white" : "bg-danger text-white"
    }`;
    badge.hidden = false;
  }

  private async refreshFromSheet(): Promise<void> {
    const { mode, sheetId, sheetTab, refreshMinutes } = this.config.menu;
    if (mode !== "runtime" || !sheetId) return;

    const sheet = await this.fetchSheet(sheetId, sheetTab, refreshMinutes);
    if (!sheet) return;

    for (const [id, row] of Object.entries(sheet)) {
      const item = this.items.get(id);
      const card = document.querySelector<HTMLElement>(
        `[data-product][data-id="${CSS.escape(id)}"]`,
      );
      if (!item) continue;

      if (typeof row.price === "number") {
        item.price = row.price;
        if (card) {
          card.dataset.price = String(row.price);
          const priceNode = card.querySelector<HTMLElement>(
            "[data-price-display]",
          );
          if (priceNode) priceNode.textContent = formatPrice(row.price);
        }
      }

      if (typeof row.available === "boolean") {
        item.available = row.available;
        if (card) {
          card.dataset.available = String(row.available);
          card.classList.toggle("opacity-60", !row.available);
          const addButton = card.querySelector<HTMLButtonElement>("[data-add]");
          if (addButton) addButton.disabled = !row.available;
          const soldOut = card.querySelector<HTMLElement>("[data-sold-out]");
          if (soldOut) soldOut.hidden = row.available;
        }
      }
    }

    this.render();
  }

  private async fetchSheet(
    sheetId: string,
    sheetTab: string,
    refreshMinutes: number,
  ) {
    const cacheKey = `${CACHE_KEY}:${sheetId}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as { at: number; data: unknown };
        if (Date.now() - parsed.at < refreshMinutes * 60_000) {
          return parsed.data as ReturnType<typeof parseMenuSheet>;
        }
      }
    } catch {
      /* ignore cache errors */
    }

    try {
      const response = await fetch(getSheetCsvUrl(sheetId, sheetTab));
      if (!response.ok) return null;
      const data = parseMenuSheet(await response.text());
      try {
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({ at: Date.now(), data }),
        );
      } catch {
        /* ignore cache write errors */
      }
      return data;
    } catch {
      return null;
    }
  }
}

const config = readConfig();
if (config) {
  new OrderApp(config).init();
}
