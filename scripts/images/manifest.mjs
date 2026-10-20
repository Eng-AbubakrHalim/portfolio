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
  // ---------------- DAQ module (company work: cropped, no product name) ----------------
  {
    slug: 'daq-module',
    name: 'daq-cover',
    role: 'cover',
    // The 10 Sep render of the same section has Altium's light-handle widget over the regulator.
    src: S('2026-08-28 141345'),
    crop: { left: 30, top: 50, width: 790, height: 494 },
    alt: '3D render of the power section: switching regulator, three inductors, catch diodes and a bulk input capacitor.',
    caption: 'Power section, 3D view in Altium (cropped).',
  },
  {
    slug: 'daq-module',
    name: 'daq-3d-top',
    src: S('2026-09-28 113605'),
    crop: { left: 105, top: 12, width: 575, height: 556 },
    alt: '3D render of the upper part of the DAQ board: power section top left, two RJ45 jacks, the MCU in the middle, input terminals down the left edge and output terminals on the right.',
    caption: 'Top side, cropped: power entry top left, input terminals down the left edge, outputs on the right.',
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
    src: S('2026-10-09 101904'),
    crop: { left: 0, top: 150, width: 690, height: 460 },
    aspect: 16 / 10,
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
];
