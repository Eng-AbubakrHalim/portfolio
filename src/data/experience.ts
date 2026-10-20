import type { Thumb } from '../components/Thumbs.astro';
import cabinet from '../assets/projects/tsh/tsh-control-cabinet.jpg';
import training from '../assets/projects/robocon/robocon-training.jpg';
import mentoring from '../assets/projects/workshop/workshop-mentoring.jpg';
import presenting from '../assets/projects/workshop/workshop-presenting.jpg';
import referee from '../assets/projects/iyrc/iyrc-referee.jpg';

/** 03 — Experience. Dates are 'YYYY-MM'; `end` omitted means a single month. */
export interface Role {
  role: string;
  org: string;
  place?: string;
  start: string;
  end?: string;
  points: string[];
  images?: Thumb[];
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
    images: [
      { src: cabinet, alt: 'Abubakr checking an open industrial control cabinet with drive modules and wiring, taking notes on a tablet.', caption: 'Checking a control cabinet' },
    ],
  },
  {
    role: 'Electronics Head of Department',
    org: 'UTM Robocon',
    place: "Malaysia's team at ABU Robocon",
    start: '2024-06',
    end: '2025-05',
    points: [
      'Led the electronics department through the 2024 and 2025 competition cycles.',
      '4-layer STM32 control and motor-interface boards in Altium, linked over CAN.',
      'Sole electronics lead between the mechanical and software teams.',
    ],
  },
];

export const leadership: Role[] = [
  {
    role: 'Workshop Instructor',
    org: 'EEExplore',
    place: 'Remote, Sudan',
    start: '2025-09',
    end: 'now',
    points: ['Teaching and lecturing EEExplore workshops, remotely.'],
  },
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
    images: [{ src: referee, alt: 'Abubakr in a blue referee vest on the IYRC competition floor, giving a thumbs up.', caption: 'IYRC ASEAN 2025' }],
  },
  {
    role: 'Presenter and mentor',
    org: 'Self-Balancing Robot Workshop',
    start: '2025-05',
    points: ['Month-long programme from zero to a working robot: delivered the embedded systems and PCB design sessions and mentored students one to one.'],
    images: [
      { src: mentoring, alt: "Abubakr pointing at a student's laptop screen during the self-balancing robot workshop.", caption: 'Mentoring' },
      { src: presenting, alt: 'Abubakr speaking into a microphone at a laptop during the workshop.', caption: 'Presenting' },
    ],
  },
  {
    role: 'Trainer',
    org: 'UTM Robocon',
    start: '2024-06',
    end: '2025-05',
    points: ['Trained 50+ apprentices in Altium Designer, STM32 programming and circuit analysis as head of department.'],
    images: [{ src: training, alt: 'Abubakr speaking at a lectern during a Robocon training session at UTM.', caption: 'Training session at UTM' }],
  },
];

export const education = [
  {
    degree: 'Bachelor of Electrical Engineering (Hons)',
    school: 'Universiti Teknologi Malaysia',
    start: '2023-03',
    end: '2027-02',
    notes: ['Final-year project: supraharmonic emissions in PV inverter systems', 'Student member, Saudi Council of Engineers'],
  },
  {
    degree: 'Student',
    school: 'University of Khartoum',
    start: '2021-08',
    end: '2022-09',
    notes: [],
  },
];

export const certifications = [
  { title: 'PCB Basic Design (Altium Fundamentals)', issuer: 'Altium Education', when: 'Sep 2026' },
];

export const awards = [
  { title: 'Gold Medal, University Student Innovator', event: 'Malaysia Invention & Innovation Expo (MIIE)', when: '2026', project: 'Smart Posture Correction' },
  { title: 'Industry Award', event: "UTM's 9th EE Capstone Showcase", when: 'Jan 2026', project: 'Smart Posture Correction' },
];

/** Rows for the timeline chart (Experience section). */
export const timeline = [
  { label: 'BEng, UTM', start: '2023-03', end: '2027-02', kind: 'study' },
  { label: 'UTM Robocon', start: '2024-06', end: '2025-05', kind: 'role' },
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
  if (end === 'now') return `${formatMonth(start)} – now`;
  if (!end || end === start) return formatMonth(start);
  const [sy] = start.split('-');
  const [ey] = end.split('-');
  return sy === ey
    ? `${MONTHS[Number(start.split('-')[1]) - 1]} – ${formatMonth(end)}`
    : `${formatMonth(start)} – ${formatMonth(end)}`;
}
