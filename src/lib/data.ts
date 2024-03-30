import { NestedLink } from './types';

export const NavSectionNestedLinks: NestedLink[] = [
  {
    title: 'Characteristics of Algorithms',
    href: '/notes/chapter1/section1',

    category: 'Chapter 1',
  },
  {
    title: 'Section 2',
    href: '/notes/chapter1/section2',

    category: 'Chapter 1',
  },
  {
    title: 'Section 1',
    href: '/notes/chapter2/section1',
  },
  {
    title: 'Section 2',
    href: '/notes/chapter2/section2',
  },
];

const categoryLinks = (category?: string) => {
  if (!category) {
    return NavSectionNestedLinks.filter((link) => !link.category);
  }

  return NavSectionNestedLinks.filter((link) => link.category === category);
};

export const getNestedLink = (href: string): NestedLink | null => {
  return NavSectionNestedLinks.find((link) => link.href === href) || null;
};

export const NavSectionLinks: { category: string; links: NestedLink[] }[] = [
  {
    category: 'Introduction',
    links: categoryLinks(),
  },
  {
    category: 'Chapter 1',
    links: categoryLinks('Chapter 1'),
  },
];
