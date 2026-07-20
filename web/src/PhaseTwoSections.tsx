import { ManualInstall } from "./phase-two/ManualInstall";
import { ProductTour } from "./phase-two/ProductTour";
import type { Locale } from "./phase-two/content";

interface PhaseTwoSectionsProps {
  locale: Locale;
}

/** Renders the interactive product tour followed by manual-install guidance. */
export function PhaseTwoSections({ locale }: PhaseTwoSectionsProps) {
  return (
    <>
      <ProductTour locale={locale} />
      <ManualInstall locale={locale} />
    </>
  );
}
