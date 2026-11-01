import type { Thumb } from '../components/Thumbs.astro';
import robocon3d from '../assets/projects/robocon/robocon-board-3d.jpg';
import roboconRobot from '../assets/projects/robocon/robocon-board-on-robot.jpg';
import fypModel from '../assets/projects/fyp/fyp-model.png';
import fypSpectrum from '../assets/projects/fyp/fyp-grid-spectrum.png';
import fypHeating from '../assets/projects/fyp/fyp-dielectric-heating.png';
import roboconSoldering from '../assets/projects/robocon/robocon-soldering.jpg';
import roboconSchematic from '../assets/projects/robocon/robocon-schematic.jpg';
import roboconBluepill from '../assets/projects/robocon/robocon-bluepill.jpg';
import perfboard from '../assets/projects/custom-boards/custom-board-stm32.jpg';
import buckLayout from '../assets/projects/custom-boards/custom-buck-layout.jpg';
import etched from '../assets/projects/custom-boards/custom-etched.jpg';
import dido from '../assets/projects/tsh/tsh-dido-testing.jpg';

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
  images?: Thumb[];
}

export const otherProjects: OtherProject[] = [
  {
    title: 'Supraharmonic emissions in PV inverter systems',
    context: 'Final-year project, Universiti Teknologi Malaysia',
    year: '2026–27',
    tags: ['Power quality', 'MATLAB / Simulink', 'In progress'],
    details: [
      'Open-loop simulation in MATLAB/Simulink: a two-level inverter (600 V DC, 15.8 kHz sinusoidal PWM) feeding a 400 V, 50 Hz grid through an LCL filter.',
      'Emission spectrum from an FFT set up to IEC 61000-4-7 grouping, with three harm indicators (THD-S, dielectric-heating power and the cable-termination index QSH) at the inverter terminals and the point of common coupling.',
      'Grid current distortion up to 2.5 kHz was 1.40%, within IEEE 519, yet supraharmonic distortion at the inverter terminals reached 13.42%: a compliant inverter can still stress its own terminals. Part two extends this to a multi-inverter network.',
    ],
    images: [
      { src: fypModel, alt: 'Simulink model of the single-inverter system: sine references and a PWM generator drive a two-level bridge fed from a PV DC source, through an LCL filter to a three-phase grid.', caption: 'Open-loop model in Simulink' },
      { src: fypSpectrum, alt: 'Grid-side current spectrum up to about 17 kHz; the title reads THD 1.40 percent.', caption: 'Grid side: THD 1.40%' },
      { src: fypHeating, alt: 'Dielectric loss per harmonic against frequency up to 150 kHz at the inverter terminals, largest near 15.7 kHz.', caption: 'Dielectric heating by frequency' },
    ],
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
      'Joined through the Autocar Challenge in November 2023, then the apprentice training in SolidWorks, Altium and the STM32 Blue Pill.',
    ],
    images: [
      { src: robocon3d, alt: '3D render of a Robocon control board with a central QFP microcontroller surrounded by rows of connectors.', caption: 'Control board, Altium 3D' },
      { src: roboconRobot, alt: 'A black UTM Robocon PCB mounted on the robot, with many cables plugged into its connectors.', caption: 'In service on the robot' },
      { src: roboconSchematic, alt: 'A Robocon schematic in Altium, laid out in labelled blocks for power, logic and drivers.', caption: 'Board schematic in Altium' },
      { src: roboconSoldering, alt: 'Abubakr soldering a small PCB at a workbench in the Robocon lab.', caption: 'Assembly in the lab' },
      { src: roboconBluepill, alt: 'An STM32 Blue Pill board on a breadboard with jumper wires.', caption: 'Blue Pill prototyping, apprentice training' },
    ],
  },
  {
    title: 'Self-balancing robot',
    context: 'Two-wheeled balancing robot',
    year: '2025',
    tags: ['ESP32', 'MPU6050', 'PID'],
    details: ['ESP32 and MPU6050 with a real-time PID loop tuned to stay stable under disturbances.'],
  },
  {
    title: 'Line follower with Bluetooth override',
    context: 'Autonomous vehicle',
    year: '2023',
    tags: ['STM32', 'Bluetooth'],
    details: ['STM32-based line tracking with sensor fusion, plus a Bluetooth link for manual override.'],
  },
  {
    title: 'Custom boards',
    context: 'Small PCBs designed, built and tested during the Robocon years',
    year: '2024–25',
    tags: ['KiCad', 'Altium'],
    details: [
      'Isolated valve drivers, DC-DC buck converters, ESP32 breakout boards and STM32 development boards.',
      'Each one taken through design-for-manufacture checks and functional testing.',
    ],
    images: [
      { src: perfboard, alt: 'A green perfboard prototype with a blue STM32 development module, an 8-pin IC, trimmers and push buttons, held in front of a laptop showing its schematic.', caption: 'STM32 perfboard prototype' },
      { src: buckLayout, alt: 'Altium layout of a small buck converter board built around an LM2596 regulator, with its inductor, input and output capacitors and a switch.', caption: 'LM2596 buck converter layout' },
      { src: etched, alt: 'Two home-etched copper PCBs with their traces visible, held up to the camera.', caption: 'Home-etched prototypes' },
    ],
  },
  {
    title: 'DI/DO field testing kit',
    context: 'TSH Group',
    year: '2025',
    tags: ['PLC', 'Industrial I/O'],
    details: ['A digital I/O test kit built from scratch for verifying industrial PLC signals in the field.'],
    images: [
      { src: dido, alt: 'Abubakr checking the PLC signals of an open industrial control cabinet, taking notes on a tablet.', caption: 'Checking PLC I/O in the cabinet' },
    ],
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
