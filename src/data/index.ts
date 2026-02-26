import type { Lang } from "../i18n/utils";

import jonathanData from "./developers/jonathan.json";
import pabloData from "./developers/pablo.json";

type I18nField = { es: string; en: string };

const developers: Record<string, typeof jonathanData> = {
  jonathan: jonathanData,
  pablo: pabloData,
};

function resolve(field: I18nField, lang: Lang): string {
  return field[lang] ?? field.es;
}

export function getDeveloperData(slug: string, lang: Lang) {
  const raw = developers[slug];
  if (!raw) return null;

  return {
    hero: {
      name: raw.hero.name,
      role: resolve(raw.hero.role, lang),
      bio: resolve(raw.hero.bio, lang),
      avatarUrl: raw.hero.avatarUrl,
      links: raw.hero.links,
    },
    experiences: raw.experiences.map((exp) => ({
      company: exp.company,
      role: resolve(exp.role, lang),
      period: resolve(exp.period, lang),
      description: resolve(exp.description, lang),
      tags: exp.tags,
    })),
    projects: raw.projects.map((proj) => ({
      title: resolve(proj.title, lang),
      description: resolve(proj.description, lang),
      tags: proj.tags,
    })),
    skills: raw.skills.map((skill) => ({
      name: skill.name,
      level: skill.level,
      category: resolve(skill.category, lang),
    })),
    stack: raw.stack.map((group) => ({
      category: resolve(group.category, lang),
      items: group.items,
    })),
  };
}
