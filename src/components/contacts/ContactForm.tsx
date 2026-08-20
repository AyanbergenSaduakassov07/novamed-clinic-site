"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/lib/contacts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Errors = { name?: boolean; phone?: boolean };

/**
 * There is no backend, and adding one to collect health-adjacent details would
 * be the wrong default. This composes what the visitor typed into a WhatsApp
 * message and hands it to them: nothing leaves the browser until they press
 * send inside WhatsApp, which the note under the button says plainly.
 *
 * Input is never cleared on a validation error.
 */
export function ContactForm() {
  const t = useTranslations("contacts");
  const tWa = useTranslations("wa");
  const id = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const next: Errors = {};
    if (!name.trim()) next.name = true;
    // Deliberately loose: 10+ digits. Patients write numbers many ways and a
    // strict mask would reject valid input.
    if (phone.replace(/\D/g, "").length < 10) next.phone = true;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const text = tWa("form", {
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
    });
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  const field =
    "min-h-12 w-full rounded-[0.9rem] border-2 bg-white px-4 py-3 text-base text-ink " +
    "transition-colors duration-150 placeholder:text-ink-muted/70 " +
    "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor={`${id}-name`} className="block text-sm font-medium text-ink">
          {t("formName")}
        </label>
        <input
          id={`${id}-name`}
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          aria-invalid={errors.name || undefined}
          aria-describedby={errors.name ? `${id}-name-err` : undefined}
          className={cn(field, "mt-2", errors.name ? "border-mame-fg" : "border-ink-faint")}
        />
        {errors.name && (
          <p id={`${id}-name-err`} role="alert" className="mt-1.5 text-sm text-ink">
            {t("formRequired")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className="block text-sm font-medium text-ink">
          {t("formPhone")}
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          placeholder="+7 7__ ___ __ __"
          aria-invalid={errors.phone || undefined}
          aria-describedby={errors.phone ? `${id}-phone-err` : undefined}
          className={cn(field, "mt-2", errors.phone ? "border-mame-fg" : "border-ink-faint")}
        />
        {errors.phone && (
          <p id={`${id}-phone-err`} role="alert" className="mt-1.5 text-sm text-ink">
            {t("formPhoneInvalid")}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-msg`} className="block text-sm font-medium text-ink">
          {t("formMessage")}
        </label>
        <textarea
          id={`${id}-msg`}
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("formMessagePlaceholder")}
          className={cn(field, "mt-2 resize-y border-ink-faint")}
        />
      </div>

      <Button type="submit" size="lg" className="self-start">
        {t("formSubmit")}
      </Button>

      <p className="text-sm text-ink-muted">{t("formNote")}</p>
    </form>
  );
}
