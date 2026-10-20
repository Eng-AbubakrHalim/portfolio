/** 04 — Toolkit as a spec sheet, grouped by domain. `usedIn` points at work and project rows. */
export const toolkit = [
  {
    domain: 'Hardware design',
    tools: ['Altium Designer', 'KiCad', 'Schematic capture and review', '4-layer PCB layout', 'Rigid-flex to IPC-2223', 'Footprints from connector specs', 'SolidWorks enclosures'],
    usedIn: ['DAQ module', 'SSD tester adapter', 'Smart Posture Correction', 'UTM Robocon'],
  },
  {
    domain: 'Simulation',
    tools: ['LTspice', 'PSpice', 'ngspice', 'MATLAB / Simulink', 'NI Multisim'],
    usedIn: ['DAQ output stage'],
  },
  {
    domain: 'Firmware',
    tools: ['Embedded C on STM32', 'STM32CubeMX', 'STM32CubeIDE', 'Peripheral bring-up and drivers', 'ESP32 (C++)', 'CAN, I²C, SPI, RS-485'],
    usedIn: ['UTM Robocon', 'Smart Posture Correction'],
  },
  {
    domain: 'Software',
    tools: ['Python', 'C / C++', 'OpenCV', 'PyMuPDF', 'SQLite FTS5'],
    usedIn: ['Datasheet lookup tool', 'Smart Posture Correction'],
  },
  {
    domain: 'Industrial',
    tools: ['PLC testing', 'Industrial wiring', 'DI/DO signal verification'],
    usedIn: ['TSH Group'],
  },
];
