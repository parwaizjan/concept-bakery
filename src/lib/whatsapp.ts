import { site } from "../data/site";
import type { UiKey } from "../i18n/ui";
import { formatPrice } from "./format";

export type Fulfillment = "pickup" | "delivery";

export type OrderLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type OrderDetails = {
  lines: OrderLine[];
  total: number;
  fulfillment: Fulfillment;
  name: string;
  phone: string;
  address?: string;
  notes?: string;
};

type Translate = (key: UiKey) => string;

/**
 * Build the plain-text WhatsApp order message. Kept human-readable on a phone and
 * localized where it does not confuse the owner. Uses WhatsApp `*bold*` markup.
 */
export function buildOrderMessage(order: OrderDetails, t: Translate): string {
  const itemLines = order.lines.map(
    (line, index) =>
      `${index + 1}. ${line.name} x${line.qty} — ${formatPrice(line.price * line.qty)}`,
  );

  const parts: string[] = [
    t("msg.intro"),
    "",
    `*${t("msg.items")}*`,
    ...itemLines,
    "",
    `*${t("msg.total")}*: ${formatPrice(order.total)}`,
    "",
    `*${t("msg.type")}*: ${
      order.fulfillment === "pickup" ? t("order.pickup") : t("order.delivery")
    }`,
    `*${t("msg.name")}*: ${order.name}`,
    `*${t("msg.phone")}*: ${order.phone}`,
  ];

  if (order.fulfillment === "delivery" && order.address?.trim()) {
    parts.push(`*${t("msg.address")}*: ${order.address.trim()}`);
  }

  if (order.notes?.trim()) {
    parts.push(`*${t("msg.notes")}*: ${order.notes.trim()}`);
  }

  parts.push("", t("msg.footer"));
  return parts.join("\n");
}

/** Build a wa.me deep link. The number must be digits only (country code, no +). */
export function buildWhatsAppUrl(
  message: string,
  number: string = site.whatsappNumber,
): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
