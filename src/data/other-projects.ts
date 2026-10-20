/**
 * 02 — Other projects: compact rows that expand to a few details.
 * Facts come from the brief, the v1 site and the CV only; unknown years stay empty.
 */
export interface OtherProject {
  title: string;
  context: string;
  year?: string;
  tags: string[];
  details: string[];
}

export const otherProjects: OtherProject[] = [
  {
    title: 'Supraharmonic emissions in PV inverter systems',
    context: 'Final-year project, Universiti Teknologi Malaysia',
    year: '2026–27',
    tags: ['Power quality', 'In progress'],
    details: ['Final-year research on supraharmonic emissions (2–150 kHz) from photovoltaic inverter systems.'],
  },
  {
    title: 'UTM Robocon electronics',
    context: "Malaysia's team at ABU Robocon 2024 and 2025",
    year: '2024–25',
    tags: ['Altium', 'STM32', 'CAN'],
    details: [
      '4-layer STM32F4 main-control and STM32G4 motor-interface boards, with CAN, I²C and SPI links across all subsystems.',
      'Upgraded the mainboard with better short-circuit protection and layout.',
      'Designed a custom IMU board for navigation and STM32 + PID control for the shooter mechanism.',
    ],
  },
  {
    title: 'Self-balancing robot',
    context: 'Two-wheeled balancing robot',
    tags: ['ESP32', 'MPU6050', 'PID'],
    details: ['ESP32 and MPU6050 with a real-time PID loop tuned to stay stable under disturbances.'],
  },
  {
    title: 'Line follower with Bluetooth override',
    context: 'Autonomous vehicle',
    tags: ['STM32', 'Bluetooth'],
    details: ['STM32-based line tracking with sensor fusion, plus a Bluetooth link for manual override.'],
  },
  {
    title: 'Custom boards',
    context: 'Small PCBs designed, built and tested',
    tags: ['KiCad', 'Altium'],
    details: [
      'Isolated valve drivers, DC-DC buck converters, ESP32 breakout boards and STM32 development boards.',
      'Each one taken through design-for-manufacture checks and functional testing.',
    ],
  },
  {
    title: 'DI/DO field testing kit',
    context: 'TSH Group',
    year: '2025',
    tags: ['PLC', 'Industrial I/O'],
    details: ['A digital I/O test kit built from scratch for verifying industrial PLC signals in the field.'],
  },
  {
    title: 'FIRST Global Challenge, Team Sudan',
    context: 'Mentor',
    year: '2026',
    tags: ['Mentoring'],
    details: [
      'Mentored Team Sudan, a student team working across eight countries, for the 2026 challenge in Incheon, South Korea.',
    ],
  },
];
