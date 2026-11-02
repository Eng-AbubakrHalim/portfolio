// Selected images for the site: source, processing steps, alt text and caption.
// Coordinates are in source pixels. Sources live in the gitignored _raw/ folder.
// Ops run in order before the crop:
//   bgRows  {x0,x1,y0,y1,refX}  paint each row with the colour at (refX, row): patches gradients
//   copyRow {x0,x1,y0,y1,srcY}  repeat a clean row (rebuild an edge profile)
//   copyCol {x0,x1,y0,y1,srcX}  repeat a clean column
//   fill    {x,y,w,h,color}     flat colour (e.g. black over a dialog on a black plot)
//   blur    {x,y,w,h}           blur a small label
// `aspect` pads to that ratio by extending edge pixels (seamless on flat or gradient backgrounds).

const S = (stamp) => `screens/Screenshot ${stamp}.png`;

export const images = [
  // ---------------- DAQ module (PyDAQ mini) ----------------
  {
    slug: 'daq-module',
    name: 'daq-cover',
    role: 'cover',
    src: S('2026-09-29 103206'),
    ops: [
      // Altium's axis gizmo at the board's bottom-left corner. The green Y arm runs down the
      // board's left edge (x 190-193), the red X arm along its bottom edge (y 728-732).
      // Rebuild the bottom edge from a clean column, then clear what is left of the gizmo
      // left of the board. Rows start at 693, below the input connector.
      { op: 'copyCol', x0: 194, x1: 268, y0: 724, y1: 775, srcX: 275 },
      { op: 'bgRows', x0: 140, x1: 193, y0: 693, y1: 775, refX: 130 },
    ],
    aspect: 16 / 10,
    alt: 'Altium 3D render of the whole PyDAQ mini board from the top: power section and two RJ45 jacks along the top, input terminal blocks down the left edge, output terminals on the right, the RTD input connector at the bottom and a coin cell holder.',
    caption: 'PyDAQ mini, top side (Altium 3D).',
  },
  {
    slug: 'daq-module',
    name: 'daq-layout-top',
    src: S('2026-09-29 102956'),
    crop: { left: 22, top: 12, width: 590, height: 762 },
    alt: 'Top-layer PCB layout of the whole board with the placement rooms labelled: SMPS top left, PHY and MCU in the middle, DAC lower middle, with the input connectors down the left edge.',
    caption: 'Top layer with the placement rooms: power supply, Ethernet PHY, MCU and DAC.',
  },
  {
    slug: 'daq-module',
    name: 'daq-sch-power',
    src: 'sch/daq-sch-power.png',
    alt: 'Schematic of the power regulator: an LT3514 triple buck taking 24 V in through an input filter, with its outputs on the nets VP5V8, VP3V3_RAW and VP13V5.',
    caption: 'Power regulator sheet: the LT3514 triple buck.',
  },
  {
    slug: 'daq-module',
    name: 'daq-sch-adc',
    src: 'sch/daq-sch-adc.png',
    alt: 'Schematic of the ADC sheet: the AD4111 with eight voltage inputs and four current inputs, SPI to the MCU, an ADR4525 voltage reference and a crystal.',
    caption: 'ADC sheet: AD4111 with its reference and crystal.',
  },
  {
    slug: 'daq-module',
    name: 'daq-sch-output',
    src: 'sch/daq-sch-output.png',
    alt: 'Schematic of the voltage outputs: a TLV76701 LDO making 12 V from the 13.5 V rail, and two of the four output stages, each a TLV9301 op-amp with a 10 ohm isolation resistor, a 47 pF feedback capacitor and a 10 k / 10 k divider setting a gain of 2.',
    caption: 'Voltage-output sheet: the 12 V LDO and two of the four output stages.',
  },
  {
    slug: 'daq-module',
    name: 'daq-power-startup-sim',
    src: S('2026-08-13 152428'),
    crop: { left: 0, top: 142, width: 1919, height: 406 },
    alt: 'LTspice plot of the triple buck regulator starting up: output voltages and load currents rise from zero and settle within the 0 to 800 microsecond window.',
    caption: 'Start-up transient of the triple buck converter in LTspice, 0–800 µs.',
  },
  {
    slug: 'daq-module',
    name: 'daq-ripple-sim',
    src: S('2026-08-21 161451'),
    ops: [
      { op: 'fill', x: 1388, y: 666, w: 304, h: 210, color: '#000000' }, // cursor dialog (sim file name)
      // OS watermark sits on the x-axis: rebuild that strip from a clean column of the same rows.
      { op: 'copyCol', x0: 1588, x1: 1850, y0: 936, y1: 984, srcX: 1500 },
    ],
    crop: { left: 0, top: 110, width: 1919, height: 895 },
    alt: 'LTspice plot of one output rail in steady state, zoomed to millivolts: a small sinusoidal ripple between about 11.913 and 11.917 volts.',
    caption: 'Steady-state ripple on the 12 V rail: about 3.4 mV peak to peak between the cursors.',
  },
  {
    slug: 'daq-module',
    name: 'daq-output-stage-bench',
    src: S('2026-09-08 115613'),
    alt: 'PSpice testbench of the analog output stage: a TLV9302 op-amp at a gain of 2 with a 10 ohm isolation resistor and a 47 pF feedback capacitor driving a 1 nF load. Bias points show 3 V in and 6 V out.',
    caption: 'Output-stage testbench in PSpice: isolation resistor and feedback capacitor against a 1 nF load.',
  },
  {
    slug: 'daq-module',
    name: 'daq-ethernet-pair',
    src: S('2026-09-04 163339'),
    crop: { left: 40, top: 20, width: 540, height: 880 },
    alt: 'PCB layout close-up of an Ethernet transmit pair routed together from the jack pins down to the PHY, with a small length-matching loop near the top.',
    caption: 'Ethernet transmit pair, routed as a coupled differential pair (layout detail).',
  },

  // ---------------- M.2-to-EDSFF adapter ----------------
  {
    slug: 'ssd-adapter',
    name: 'adapter-cover',
    role: 'cover',
    src: S('2026-09-29 161257'),
    ops: [
      // Altium light-handle (orange) under the flex section, on the background.
      { op: 'bgRows', x0: 420, x1: 510, y0: 380, y1: 495, refX: 395 },
      // Axis gizmo: the Y arrow on the board, then the X arrow and labels across the board edge.
      { op: 'copyCol', x0: 850, x1: 866, y0: 376, y1: 417, srcX: 840 },
      { op: 'copyCol', x0: 853, x1: 860, y0: 417, y1: 436, srcX: 840 }, // stop short of the TP24 label
      { op: 'copyCol', x0: 845, x1: 932, y0: 436, y1: 490, srcX: 835 },
    ],
    aspect: 16 / 10,
    alt: 'Altium 3D render of the rigid-flex adapter from the top: the M.2 end with its gold fingers on the left, the flex section in the middle, and the EDSFF end on the right with two ICs and test points.',
    caption: 'Rigid–flex adapter, top side (Altium 3D).',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-layout',
    src: S('2026-10-07 143801'),
    crop: { left: 0, top: 18, width: 1300, height: 700 },
    alt: 'PCB layout of the whole adapter: the EDSFF end on the left and the M.2 end on the right, both rigid, with the flex region between them carrying parallel traces.',
    caption: 'Full layout: EDSFF end (left), flex region (centre), M.2 end (right).',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-stackup-m2',
    src: S('2026-10-06 172344'),
    crop: { left: 75, top: 82, width: 665, height: 325 },
    alt: 'Stack-up drawing for the M.2 end: four copper layers with cores and prepregs between them, solder mask and nickel-gold finish on both sides, total thickness 0.813 mm.',
    caption: 'Stack-up drawing, M.2 end: four layers, 0.813 mm total.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-stack-view',
    src: S('2026-10-09 101904'),
    crop: { left: 0, top: 150, width: 690, height: 460 },
    alt: 'Altium layer-stack view of the adapter: two thick rigid sections, labelled EDSFF end and M.2 end, joined by a thin flex section.',
    caption: 'Rigid–flex–rigid build in the layer-stack view.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-3d-bottom',
    src: S('2026-10-07 143700'),
    ops: [
      // Remove the axis gizmo that sits on the board's bottom-left corner.
      { op: 'copyRow', x0: 102, x1: 107, y0: 535, y1: 611, srcY: 530 },
      { op: 'bgRows', x0: 30, x1: 101, y0: 535, y1: 662, refX: 15 },
      { op: 'copyCol', x0: 102, x1: 185, y0: 612, y1: 662, srcX: 300 },
      { op: 'copyRow', x0: 102, x1: 105, y0: 612, y1: 621, srcY: 530 }, // close the corner
    ],
    alt: '3D render of the rigid-flex adapter, bottom side: EDSFF gold fingers on the left, M.2 Key M fingers on the right, a teal flex section between them and test points along both rigid ends.',
    caption: 'Bottom side: EDSFF edge on the left, M.2 edge on the right.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-section',
    src: S('2026-10-07 143441'),
    alt: 'Section view of the build: the rigid EDSFF end, a thin flex section and the rigid M.2 end, with plated vias through each rigid section.',
    caption: 'Section view: the flex layers run continuously into both rigid ends.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-m2-footprint',
    src: S('2026-10-07 143018'),
    alt: 'Footprint of the M.2 edge connector: two groups of gold-finger pads either side of the key gap, on a chamfered board edge.',
    caption: 'M.2 gold-finger footprint, built from the connector spec dimensions.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-stacked-footprint',
    src: S('2026-10-07 142813'),
    alt: 'One footprint that overlays three 8-pin package outlines of different sizes, nested inside each other, so any one of the three packages can be fitted to the same site.',
    caption: 'Stacked footprint: three package options for the same 8-pin sensor share one site.',
  },

  // ---------------- Smart Posture Correction ----------------
  {
    slug: 'smart-posture',
    name: 'posture-cover',
    role: 'cover',
    src: 'legacy/site-images/posture_pcb_layout.jpg',
    crop: { left: 180, top: 230, width: 1424, height: 890 },
    alt: 'KiCad 3D render of the capstone PCB: a microcontroller module footprint, an IMU header, two push buttons, red LEDs, a TO-220 regulator and electrolytic capacitors.',
    caption: 'Capstone PCB, KiCad 3D view.',
  },
  {
    slug: 'smart-posture',
    name: 'posture-enclosure',
    src: 'legacy/site-images/posture_enclosure.jpg',
    crop: { left: 280, top: 20, width: 780, height: 570 },
    alt: 'SolidWorks exploded view of the wearable enclosure: the lid with button cut-outs lifted above the base, which holds the battery and the green PCB.',
    caption: 'Wearable enclosure in SolidWorks, exploded view.',
  },
  {
    slug: 'smart-posture',
    name: 'posture-award',
    src: 'legacy/site-images/posture_stage.jpg',
    alt: 'Abubakr and his capstone team holding their award medals at the UTM capstone showcase.',
    caption: 'Industry Award, UTM 9th EE Capstone Showcase, January 2026.',
  },

  // ---------------- Other projects and experience ----------------
  {
    slug: 'robocon',
    name: 'robocon-board-3d',
    src: 'legacy/site-images/robocon_pcb2.jpg',
    alt: '3D render of a Robocon control board: a central QFP microcontroller surrounded by rows of connectors.',
    caption: 'Robocon control board, Altium 3D view.',
  },
  {
    slug: 'robocon',
    name: 'robocon-board-on-robot',
    src: 'legacy/site-images/robocon_pcb3.jpg',
    alt: 'A black UTM Robocon PCB mounted on the robot, with many cables plugged into its connectors.',
    caption: 'A Robocon board in service on the robot.',
  },
  {
    slug: 'robocon',
    name: 'robocon-training',
    src: 'legacy/site-images/robocon_training.jpg',
    alt: 'Abubakr speaking at a lectern during a Robocon training session at UTM.',
    caption: 'Running a Robocon training session at UTM.',
  },
  {
    slug: 'fyp',
    name: 'fyp-model',
    src: 'fyp/OpenLoop_SingleInverter_full_model_overview.png',
    crop: { left: 120, top: 215, width: 1710, height: 780 },
    alt: 'Simulink model of the single-inverter system: sine references and a PWM generator drive a two-level bridge fed from a PV DC source, through an LCL filter to a three-phase grid, with V-I measurement blocks.',
    caption: 'Open-loop single-inverter model in Simulink.',
  },
  {
    slug: 'fyp',
    name: 'fyp-dielectric-heating',
    src: 'fyp/pdiel_distribution.png',
    alt: 'MATLAB plot of dielectric loss per harmonic against frequency up to 150 kHz at the inverter terminals, with the largest peak near 15.7 kHz and further peaks at multiples of it.',
    caption: 'Dielectric-heating contribution by frequency at the inverter terminals.',
  },
  {
    slug: 'fyp',
    name: 'fyp-grid-spectrum',
    src: 'fyp/spectrum_grid.png',
    alt: 'Grid-side current spectrum up to about 17 kHz, magnitude as a percentage of the fundamental. The title reads THD 1.40 percent.',
    caption: 'Grid-side current spectrum: THD 1.40%, within IEEE 519.',
  },
  {
    slug: 'workshop',
    name: 'workshop-mentoring',
    src: 'legacy/site-images/workshop_sbr_mentoring.jpg',
    alt: "Abubakr pointing at a student's laptop screen during the self-balancing robot workshop.",
    caption: 'Mentoring at the Self-Balancing Robot Workshop, May 2025.',
  },
  {
    slug: 'workshop',
    name: 'workshop-presenting',
    src: 'legacy/site-images/workshop_sbr_speaking.jpg',
    alt: 'Abubakr speaking into a microphone at a laptop during the workshop.',
    caption: 'Presenting a session at the workshop.',
  },
  {
    slug: 'iyrc',
    name: 'iyrc-referee',
    src: 'legacy/portfolio-pics/WhatsApp Image 2026-05-14 at 16.25.13 (1).jpeg',
    alt: 'Abubakr in a blue referee vest on the IYRC competition floor, giving a thumbs up.',
    caption: 'Refereeing at IYRC ASEAN 2025, Johor.',
  },
  {
    slug: 'custom-boards',
    name: 'custom-board-stm32',
    src: 'legacy/site-images/custom_pcbs.jpg',
    crop: { left: 0, top: 300, width: 720, height: 680 }, // below the person at the top left
    alt: 'A green perfboard prototype with a blue STM32 development module, an 8-pin IC, trimmers and push buttons, held in front of a laptop showing its schematic.',
    caption: 'An STM32 perfboard prototype, with its schematic on screen.',
  },
  {
    slug: 'tsh',
    name: 'tsh-dido-testing',
    src: 'legacy/portfolio-pics/WhatsApp Image 2026-05-14 at 16.25.14 (1).jpeg',
    crop: { left: 0, top: 80, width: 810, height: 1000 },
    alt: 'Abubakr checking the PLC signals of an open industrial control cabinet, taking notes on a tablet.',
    caption: 'Checking PLC I/O in a control cabinet during DI/DO testing.',
  },

  // ---------------- From LinkedIn posts (_raw/linkedin/) ----------------
  {
    slug: 'smart-posture',
    name: 'posture-worn',
    src: 'linkedin/capstone-11.jpg',
    alt: 'The wearable mounted on the upper back of a person in a grey jacket: a white enclosure with six square openings, held by straps.',
    caption: 'The wearable in use, on the upper back.',
  },
  {
    slug: 'smart-posture',
    name: 'posture-bench',
    src: 'linkedin/capstone-10.jpg',
    alt: 'Assembled boards on a lab bench: the custom PCB with its sensors, a battery holder, wiring and a laptop beside them.',
    caption: 'Bring-up on the bench: assembled boards and wiring.',
  },
  {
    slug: 'smart-posture',
    name: 'posture-cv',
    src: 'linkedin/capstone-05.jpg',
    alt: 'The posture-detection program running: a camera window showing a face with landmark lines and the label Inclined Sitting Position, next to the Python code and its console output.',
    caption: 'Vision pipeline running: the camera window labels the posture live.',
  },
  {
    slug: 'smart-posture',
    name: 'posture-layout',
    src: 'linkedin/capstone-09.jpg',
    alt: 'KiCad 2D layout of the capstone PCB showing both copper layers in red and blue, with the module footprint, connectors, LEDs and push buttons.',
    caption: 'PCB layout in KiCad.',
  },
  {
    slug: 'smart-posture',
    name: 'posture-medal',
    src: 'linkedin/capstone-04.jpg',
    crop: { left: 0, top: 120, width: 720, height: 720 },
    alt: 'The Industry Award medal from the UTM capstone showcase, held in a hand.',
    caption: 'The Industry Award medal, EECS 2026.',
  },
  {
    slug: 'robocon',
    name: 'robocon-soldering',
    src: 'linkedin/robocon-hod-11.jpg',
    alt: 'Abubakr soldering a small PCB at a workbench in the Robocon lab.',
    caption: 'Assembling a board in the Robocon lab.',
  },
  {
    slug: 'robocon',
    name: 'robocon-schematic',
    src: 'linkedin/robocon-hod-04.jpg',
    alt: 'A Robocon schematic in Altium, laid out in labelled blocks for power, logic and drivers.',
    caption: 'A Robocon board schematic in Altium.',
  },
  {
    slug: 'robocon',
    name: 'robocon-teaching',
    src: 'linkedin/set6-01.jpg',
    alt: 'Abubakr helping a group of students at their desks during a training session in a lecture hall.',
    caption: 'Helping apprentices during a training session.',
  },
  {
    slug: 'robocon',
    name: 'robocon-bluepill',
    src: 'linkedin/robocon-junior-02.jpg',
    alt: 'An STM32 Blue Pill board on a breadboard with jumper wires.',
    caption: 'STM32 Blue Pill prototyping, Robocon apprentice training.',
  },
  {
    slug: 'custom-boards',
    name: 'custom-buck-layout',
    src: 'linkedin/robocon-junior-05.jpg',
    alt: 'Altium layout of a small buck converter board built around an LM2596 regulator, with its inductor, input and output capacitors and a switch.',
    caption: 'LM2596 buck converter layout.',
  },
  {
    slug: 'custom-boards',
    name: 'custom-etched',
    src: 'linkedin/robocon-junior-06.jpg',
    alt: 'Two home-etched copper PCBs with their traces visible, held up to the camera.',
    caption: 'Home-etched prototype boards.',
  },
  {
    slug: 'workshop',
    name: 'workshop-group',
    src: 'linkedin/sbr-workshop-04.jpg',
    alt: 'Abubakr leaning over a table to help a group of participants at their laptops during the workshop.',
    caption: 'Helping a team at the workshop.',
  },

  // ---------------- DAQ and adapter, round two (confidentiality lifted by the company) ----------------
  {
    slug: 'daq-module',
    name: 'daq-mcu-pinout',
    src: S('2026-09-21 141234'),
    crop: { left: 0, top: 36, width: 794, height: 736 },
    alt: 'STM32CubeMX pinout of the STM32H563 in LQFP64: pins assigned to SPI chip selects for the AD4111, the two RTD converters and the AD3531, RMII signals for Ethernet, USART for RS-485, debug and GPIO outputs.',
    caption: 'MCU pin assignment in STM32CubeMX.',
  },
  {
    slug: 'daq-module',
    name: 'daq-sch-ethernet',
    src: S('2026-09-30 133812'),
    crop: { left: 22, top: 0, width: 1228, height: 663 },
    alt: 'Schematic of the Ethernet sheet: the LAN8742A PHY with its RMII lines to the MCU, its crystal and decoupling, and the transmit and receive pairs running to an RJ45 jack with integrated magnetics.',
    caption: 'Ethernet sheet: the LAN8742A PHY and the RJ45 with integrated magnetics.',
  },
  {
    slug: 'daq-module',
    name: 'daq-power-plane',
    src: S('2026-09-15 181114'),
    alt: 'Inner power layer of the six-layer board in Altium, shown alone: copper pours split into separate regions for the different supply rails, with the via field between them. The layer legend reads Int1 GND, Int2 signal, Int3 power, Int4 GND and bottom.',
    caption: 'Inner layer 3, the power plane, split into regions per rail.',
  },
  {
    slug: 'daq-module',
    name: 'daq-drc',
    src: S('2026-10-09 100955'),
    alt: 'Altium Design Rule Verification Report for the DAQ board: zero warnings and zero rule violations, with each clearance, short-circuit, un-routed net and width rule listed at a count of zero.',
    caption: 'Design-rule check: no warnings, no violations.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-sch-edsff',
    src: S('2026-09-22 095854'),
    alt: 'Schematic of the EDSFF edge connector, rows A1 to A42 and B1 to B42: power rails, side-band signals, I2C and the PCIe reference clock pair, each brought out to a test point.',
    caption: 'EDSFF edge connector schematic: power, side-band signals and the PCIe reference clock, each to a test point.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-sch-sensors',
    src: 'sch/adapter-sensors.png', // tooltip over U3 patched from U1 (same drawing, 234 rows up)
    alt: 'Schematic of the temperature sensor in its three package options, WSON, SOIC and VSSOP, each a TMP1075 on the same I2C bus and supply, with a note to place only one on the top side of the board.',
    caption: 'The same TMP1075 sensor drawn in three packages; only one is fitted.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-stacked-3d',
    src: S('2026-10-07 142901'),
    // Altium's light handle (a pale dot) above the right-hand pads.
    ops: [{ op: 'bgRows', x0: 545, x1: 610, y0: 90, y1: 165, refX: 535 }],
    crop: { left: 10, top: 40, width: 564, height: 675 },
    alt: '3D view of the stacked footprint with one 8-pin package seated on the middle set of pads, the larger and smaller pad sets left empty around it.',
    caption: '3D check of the stacked footprint with one package fitted.',
  },
  {
    slug: 'ssd-adapter',
    name: 'adapter-refclk',
    src: S('2026-09-30 182720'),
    alt: 'Close-up of the PCIe reference clock pair routed on inner layer 3, with Altium reporting the lengths: P at 1205.615 mils and N at 1205.323 mils, a difference of 0.291 mils.',
    caption: 'PCIe reference-clock pair on L3: P and N within 0.3 mil of each other.',
  },
];
