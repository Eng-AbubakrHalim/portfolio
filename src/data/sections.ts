/** Numbered home-page sections, in order. Drives the index nav and section headers. */
export const sections = [
  { id: 'work', num: '01', label: 'Work' },
  { id: 'projects', num: '02', label: 'Projects' },
  { id: 'experience', num: '03', label: 'Experience' },
  { id: 'toolkit', num: '04', label: 'Toolkit' },
  { id: 'about', num: '05', label: 'About' },
  { id: 'contact', num: '06', label: 'Contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const section = (id: SectionId) => sections.find((s) => s.id === id)!;
