import { NavLink } from './types';

export const NavLinks: NavLink[] = [
  {
    label: 'DAA',
    href: '/notes/introduction/introduction-to-daa',
    description: 'Introduction to Design and Analysis of Algorithms',
    group: 'intro',
  },
  {
    label: 'Fundamental Instructions',
    href: '/notes/introduction/fundamental-instructions',
    description: 'Characteristics of fundamental instructions',
    group: 'intro',
  },
  {
    label: 'Solving a Problem',
    href: '/notes/introduction/solving-a-problem',
    description: 'Steps for solving a problem',
    group: 'intro',
  },
  {
    label: 'Four Queens Problem',
    href: '/notes/introduction/four-queens-problem',
    description: 'Solution to the Four Queens Problem',
    group: 'intro',
  },
  {
    label: 'Introduction',
    href: '/notes/asymptotic-notation/introduction',
    description: 'Introduction to Asymptotic Notation',
    group: 'asy-not',
  },
  {
    label: 'Big - O Notation ✰✰✰',
    href: '/notes/asymptotic-notation/big-o-notation',
    description: 'Introduction to Big - O Notation',
    group: 'asy-not',
  },
  {
    label: 'Big - Ω Notation',
    href: '/notes/asymptotic-notation/big-omega-notation',
    description: 'Introduction to Big - Ω Notation',
    group: 'asy-not',
  },
  {
    label: 'Big - Θ Notation',
    href: '/notes/asymptotic-notation/big-theta-notation',
    description: 'Introduction to Big - Θ Notation',
    group: 'asy-not',
  },
  {
    label: 'Little - o Notation ✰',
    href: '/notes/asymptotic-notation/little-o-notation',
    description: 'Introduction to Little - o Notation',
    group: 'asy-not',
  },
  {
    label: 'Little - ω Notation',
    href: '/notes/asymptotic-notation/little-omega-notation',
    description: 'Introduction to Little - ω Notation',
    group: 'asy-not',
  },
  {
    label: 'Properties of Asymptotic Notations',
    href: '/notes/asymptotic-notation/prop-asyn-notation',
    description: 'Properties of Asymptotic Notations',
    group: 'asy-not',
  },
  {
    label: 'Introduction',
    href: '/notes/time-complexity/introduction',
    description: 'Introduction to Time Complexity',
    group: 'time-comp',
  },
  {
    label: 'Simple Loop',
    href: '/notes/time-complexity/simple-loop',
    description: 'Time Complexity of a Simple Loop',
    group: 'time-comp',
  },
  {
    label: 'Nested Loop',
    href: '/notes/time-complexity/nested-loop',
    description: 'Time Complexity of a Nested Loop',
    group: 'time-comp',
  },
  {
    label: 'Recursive Algorithm',
    href: '/notes/time-complexity/recursive-algorithm',
    description: 'Time Complexity of a Recursive Algorithm',
    group: 'time-comp',
  },
  {
    label: 'Introduction',
    href: '/notes/greedy-algorithm/introduction',
    description: 'Introduction to Greedy Algorithm',
    group: 'greedy',
  },
  {
    label: 'Job Sequencing',
    href: '/notes/greedy-algorithm/job-sequencing',
    description: 'Job Sequencing Problem',
    group: 'greedy',
  },
  {
    label: 'KnapSack Problem',
    href: '/notes/greedy-algorithm/knapsack-problem',
    description: 'KnapSack Problem',
    group: 'greedy',
  },
  {
    label: 'Huffman Encoding',
    href: '/notes/greedy-algorithm/huffman-encoding',
    description: 'Huffman Encoding',
    group: 'greedy',
  },
  {
    label: 'Optimal Merge Pattern',
    href: '/notes/greedy-algorithm/optimal-merge-pattern',
    description: 'Optimal Merge Pattern',
    group: 'greedy',
  },
];

export const getLinkByHref = (href: string): NavLink | null => {
  return NavLinks.find((link) => link.href === href) || null;
};

const getLinksByGroup = (group: string): NavLink[] => {
  return NavLinks.filter((link) => link.group === group);
};

export const NavNestedLinks: { category: string; links: NavLink[] }[] = [
  {
    category: 'Introduction',
    links: getLinksByGroup('intro'),
  },
  {
    category: 'Asymptotic Notation',
    links: getLinksByGroup('asy-not'),
  },
  {
    category: 'Time Complexity',
    links: getLinksByGroup('time-comp'),
  },
  {
    category: 'Greedy Algorithm ✰✰✰',
    links: getLinksByGroup('greedy'),
  },
];
