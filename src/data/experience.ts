/** 03 — Experience. Dates are 'YYYY-MM'; `end` omitted means a single month. */
export interface Role {
  role: string;
  org: string;
  place?: string;
  start: string;
  end?: string;
  points: string[];
}

export const work: Role[] = [
  {
    role: 'Embedded / PCB Design Engineer Intern',
    org: 'Pythonium.ai',
    place: 'Johor Bahru',
    start: '2026-07',
    end: '2026-10',
    points: [
      'Hardware design of an industrial DAQ module on an STM32H563: 8 single-ended (or 4 differential) voltage and 4 current inputs, 2 RTD inputs, analog outputs, Ethernet and RS-485.',
      'Passive M.2-to-EDSFF SSD tester adapter, reworked as a rigid-flex board designed to IPC-2223.',
      'Output-stage stability verified in simulation; schematic reviews with findings logged by severity.',
    ],
  },
  {
    role: 'Part-Time Engineer',
    org: 'TSH Group',
    place: 'Johor',
    start: '2025-04',
    end: '2025-07',
    points: [
      'PLC testing and industrial wiring for factory automation systems.',
      'Wrote the work instructions for MTC machine testing.',
      'Designed and built a DI/DO testing kit for field signal verification.',
    ],
  },
  {
    role: 'Electronics Head of Department',
    org: 'UTM Robocon',
    place: "Malaysia's team at ABU Robocon",
    start: '2024-01',
    end: '2025-04',
    points: [
      'Led the electronics department through the 2024 and 2025 competition cycles.',
      '4-layer STM32 control and motor-interface boards in Altium, linked over CAN.',
      'Sole electronics lead between the mechanical and software teams.',
    ],
  },
];

export const leadership: Role[] = [
  {
    role: 'Mentor',
    org: 'FIRST Global Challenge, Team Sudan',
    place: 'Incheon, South Korea',
    start: '2026-10',
    points: [],
  },
  {
    role: 'Organising committee and referee',
    org: 'IYRC 2025, International Youth Robot Competition',
    place: 'Johor',
    start: '2025-06',
    points: ['Refereed matches for teams from across Southeast Asia.'],
  },
  {
    role: 'Presenter and mentor',
    org: 'Self-Balancing Robot Workshop',
    start: '2025-05',
    points: ['Month-long programme from zero to a working robot: delivered the embedded systems and PCB design sessions and mentored students one to one.'],
  },
  {
    role: 'Trainer',
    org: 'UTM Robocon',
    start: '2024-01',
    end: '2025-04',
    points: ['Trained 20+ junior members in Altium Designer, STM32 programming and circuit analysis.'],
  },
];

export const education = {
  degree: 'Bachelor of Electrical Engineering (Hons)',
  school: 'Universiti Teknologi Malaysia',
  start: '2023-03',
  end: '2027-02',
  notes: ['Final-year project: supraharmonic emissions in PV inverter systems', 'Student member, Saudi Council of Engineers'],
};

export const awards = [
  { title: 'Gold Medal, University Student Innovator', event: 'Malaysia Invention & Innovation Expo (MIIE)', when: '2026', project: 'Smart Posture Correction' },
  { title: 'Industry Award', event: "UTM's 9th EE Capstone Showcase", when: 'Jan 2026', project: 'Smart Posture Correction' },
];

/** Rows for the timeline chart (Experience section). */
export const timeline = [
  { label: 'BEng, UTM', start: '2023-03', end: '2027-02', kind: 'study' },
  { label: 'UTM Robocon', start: '2024-01', end: '2025-04', kind: 'role' },
  { label: 'TSH Group', start: '2025-04', end: '2025-07', kind: 'role' },
  { label: 'Workshop, IYRC', start: '2025-05', end: '2025-06', kind: 'role' },
  { label: 'Pythonium.ai', start: '2026-07', end: '2026-10', kind: 'role' },
] as const;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export function formatRange(start: string, end?: string) {
  if (!end || end === start) return formatMonth(start);
  const [sy] = start.split('-');
  const [ey] = end.split('-');
  return sy === ey
    ? `${MONTHS[Number(start.split('-')[1]) - 1]} – ${formatMonth(end)}`
    : `${formatMonth(start)} – ${formatMonth(end)}`;
}
