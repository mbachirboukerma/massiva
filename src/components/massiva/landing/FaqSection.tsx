import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "../shared/SectionHeading";
import { useT } from "@/i18n/I18nProvider";

const ITEMS = [1, 2, 3, 4, 5];

export function FaqSection() {
  const t = useT();
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <SectionHeading eyebrow={t("landing.faq.eyebrow")} title={t("landing.faq.title")} align="center" />
      <Accordion type="single" collapsible className="mt-10">
        {ITEMS.map((i) => (
          <AccordionItem key={i} value={`it-${i}`} className="border-b border-border/60">
            <AccordionTrigger className="text-start text-base font-semibold hover:no-underline">{t(`landing.faq.${i}.q`)}</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{t(`landing.faq.${i}.a`)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
