import { NavLink } from './types';
import { SpotlightActionData } from '@mantine/spotlight';

export const NavLinks: NavLink[] = [
  {
    label: 'Characteristics of Algorithms',
    href: '/notes/chapter1/section1',
    group: 'Chapter 1',
    description: 'Characteristics of Algorithms',
  },
  {
    label: 'Section 2',
    href: '/notes/chapter1/section2',
    group: 'Chapter 1',
    description: 'Section 2',
  },
  {
    label: 'Section 1',
    href: '/notes/chapter2/section1',
    group: 'Chapter 2',
    description: 'Section 1',
  },
  {
    label: 'Section 2',
    href: '/notes/chapter2/section2',
    group: 'Chapter 2',
    description: 'Section 2',
  },
];

export const getNestedLink = (href: string): NavLink | null => {
  return NavLinks.find((link) => link.href === href) || null;
};

export const getLinkByGroup = (group: string): NavLink[] => {
  return NavLinks.filter((link) => link.group === group);
};

export const NavNestedLinks: { category: string; links: NavLink[] }[] = [
  {
    category: 'Chapter 1',
    links: getLinkByGroup('Chapter 1'),
  },
  {
    category: 'Chapter 2',
    links: getLinkByGroup('Chapter 2'),
  },
];
