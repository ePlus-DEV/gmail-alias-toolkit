declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  export type LucideIcon = ComponentType<
    SVGProps<SVGSVGElement> & {
      absoluteStrokeWidth?: boolean;
      size?: number | string;
    }
  >;

  export const ArrowRight: LucideIcon;
  export const AtSign: LucideIcon;
  export const BadgeCheck: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Clipboard: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const Copy: LucideIcon;
  export const Database: LucideIcon;
  export const Download: LucideIcon;
  export const EyeOff: LucideIcon;
  export const FileJson: LucideIcon;
  export const Github: LucideIcon;
  export const History: LucideIcon;
  export const Home: LucideIcon;
  export const Languages: LucideIcon;
  export const Mail: LucideIcon;
  export const Moon: LucideIcon;
  export const Plus: LucideIcon;
  export const QrCode: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Shuffle: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Sun: LucideIcon;
  export const Tags: LucideIcon;
  export const X: LucideIcon;
  export const Zap: LucideIcon;
}

declare module "*.svg?url" {
  const url: string;
  export default url;
}

declare module "*.png?url" {
  const url: string;
  export default url;
}
