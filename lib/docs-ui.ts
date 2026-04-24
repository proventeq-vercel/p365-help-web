import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BellRing,
  BookMarked,
  ClipboardList,
  Compass,
  FileText,
  FolderCog,
  History,
  Home,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  Workflow
} from "lucide-react";

interface SectionUiMeta {
  icon: LucideIcon;
  iconBadgeClass: string;
  activeClass: string;
  pillClass: string;
  cardClass: string;
}

const defaultMeta: SectionUiMeta = {
  icon: FileText,
  iconBadgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  activeClass:
    "border-slate-200 bg-slate-50/90 text-slate-900 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100",
  pillClass: "bg-slate-500/80",
  cardClass: "border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40"
};

const sectionMeta: Record<string, SectionUiMeta> = {
  home: {
    icon: Home,
    iconBadgeClass: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-200",
    activeClass:
      "border-cyan-200 bg-cyan-50/90 text-cyan-900 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-100",
    pillClass: "bg-cyan-500/90",
    cardClass: "border-cyan-200/80 bg-cyan-50/70 dark:border-cyan-800 dark:bg-cyan-950/40"
  },
  "navigation-menu": {
    icon: Compass,
    iconBadgeClass: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200",
    activeClass:
      "border-sky-200 bg-sky-50/90 text-sky-900 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100",
    pillClass: "bg-sky-500/90",
    cardClass: "border-sky-200/80 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-950/40"
  },
  manage: {
    icon: FolderCog,
    iconBadgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200",
    activeClass:
      "border-emerald-200 bg-emerald-50/90 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
    pillClass: "bg-emerald-500/90",
    cardClass: "border-emerald-200/80 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/40"
  },
  main: {
    icon: LayoutDashboard,
    iconBadgeClass: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-200",
    activeClass:
      "border-violet-200 bg-violet-50/90 text-violet-900 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-100",
    pillClass: "bg-violet-500/90",
    cardClass: "border-violet-200/80 bg-violet-50/70 dark:border-violet-800 dark:bg-violet-950/40"
  },
  reports: {
    icon: BarChart3,
    iconBadgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200",
    activeClass:
      "border-amber-200 bg-amber-50/90 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
    pillClass: "bg-amber-500/90",
    cardClass: "border-amber-200/80 bg-amber-50/70 dark:border-amber-800 dark:bg-amber-950/40"
  },
  notification: {
    icon: BellRing,
    iconBadgeClass: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200",
    activeClass:
      "border-rose-200 bg-rose-50/90 text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100",
    pillClass: "bg-rose-500/90",
    cardClass: "border-rose-200/80 bg-rose-50/70 dark:border-rose-800 dark:bg-rose-950/40"
  },
  settings: {
    icon: Settings2,
    iconBadgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    activeClass:
      "border-slate-200 bg-slate-50/90 text-slate-900 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100",
    pillClass: "bg-slate-500/90",
    cardClass: "border-slate-200/80 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40"
  },
  provisioning: {
    icon: Workflow,
    iconBadgeClass: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-200",
    activeClass:
      "border-teal-200 bg-teal-50/90 text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-100",
    pillClass: "bg-teal-500/90",
    cardClass: "border-teal-200/80 bg-teal-50/70 dark:border-teal-800 dark:bg-teal-950/40"
  },
  request: {
    icon: ClipboardList,
    iconBadgeClass: "bg-lime-100 text-lime-700 dark:bg-lime-900/50 dark:text-lime-200",
    activeClass:
      "border-lime-200 bg-lime-50/90 text-lime-900 dark:border-lime-800 dark:bg-lime-950/50 dark:text-lime-100",
    pillClass: "bg-lime-500/90",
    cardClass: "border-lime-200/80 bg-lime-50/70 dark:border-lime-800 dark:bg-lime-950/40"
  },
  history: {
    icon: History,
    iconBadgeClass: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-200",
    activeClass:
      "border-indigo-200 bg-indigo-50/90 text-indigo-900 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-100",
    pillClass: "bg-indigo-500/90",
    cardClass: "border-indigo-200/80 bg-indigo-50/70 dark:border-indigo-800 dark:bg-indigo-950/40"
  },
  approval: {
    icon: ShieldCheck,
    iconBadgeClass: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/50 dark:text-fuchsia-200",
    activeClass:
      "border-fuchsia-200 bg-fuchsia-50/90 text-fuchsia-900 dark:border-fuchsia-800 dark:bg-fuchsia-950/50 dark:text-fuchsia-100",
    pillClass: "bg-fuchsia-500/90",
    cardClass: "border-fuchsia-200/80 bg-fuchsia-50/70 dark:border-fuchsia-800 dark:bg-fuchsia-950/40"
  },
  appendix: {
    icon: BookMarked,
    iconBadgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200",
    activeClass:
      "border-orange-200 bg-orange-50/90 text-orange-900 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-100",
    pillClass: "bg-orange-500/90",
    cardClass: "border-orange-200/80 bg-orange-50/70 dark:border-orange-800 dark:bg-orange-950/40"
  }
};

function getTopSectionKey(url: string) {
  const firstSegment = url.split("/").filter(Boolean)[0];
  return firstSegment ?? "home";
}

export function getSectionUiMeta(url: string): SectionUiMeta {
  const key = getTopSectionKey(url);
  return sectionMeta[key] ?? defaultMeta;
}
