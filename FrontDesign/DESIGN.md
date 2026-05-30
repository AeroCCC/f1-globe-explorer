---
name: Apex Precision
colors:
  surface: '#0e131f'
  surface-dim: '#0e131f'
  surface-bright: '#343946'
  surface-container-lowest: '#090e19'
  surface-container-low: '#171b27'
  surface-container: '#1b1f2b'
  surface-container-high: '#252a36'
  surface-container-highest: '#303541'
  on-surface: '#dee2f3'
  on-surface-variant: '#e9bcb5'
  inverse-surface: '#dee2f3'
  inverse-on-surface: '#2c303d'
  outline: '#af8781'
  outline-variant: '#5e3f3a'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#680200'
  primary-container: '#e10600'
  on-primary-container: '#fff2f0'
  inverse-primary: '#c00500'
  secondary: '#93ccff'
  on-secondary: '#003351'
  secondary-container: '#3098dc'
  on-secondary-container: '#002c47'
  tertiary: '#c3c7cb'
  on-tertiary: '#2c3134'
  tertiary-container: '#6c7174'
  on-tertiary-container: '#f2f6fa'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410100'
  on-primary-fixed-variant: '#930300'
  secondary-fixed: '#cde5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b74'
  tertiary-fixed: '#dfe3e7'
  tertiary-fixed-dim: '#c3c7cb'
  on-tertiary-fixed: '#171c1f'
  on-tertiary-fixed-variant: '#42474b'
  background: '#0e131f'
  on-background: '#dee2f3'
  surface-variant: '#303541'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.08em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered for a high-performance telemetry environment, blending the precision of automotive engineering with cinematic digital storytelling. The aesthetic is "Technical Luxury"—a style that prioritizes data density and visual clarity without sacrificing the premium feel of a luxury editorial.

The UI targets motorsport enthusiasts and analysts, demanding an atmosphere of speed, accuracy, and exclusivity. By utilizing a "Dark-Mode First" philosophy, the design system minimizes ocular strain during low-light usage while allowing high-contrast telemetry data and the F1 Racing Red accents to command attention. The movement is a hybrid of **Minimalism** and **Glassmorphism**, using translucent layers to maintain a sense of depth and spatial awareness across a 3D planetary interface.

## Colors

The palette is rooted in a deep, "Void Blue" black to provide infinite depth for planetary rendering.

- **Deep Space (#050914):** The foundational canvas. All backgrounds and base layers reside here.
- **Racing Red (#E10600):** The primary action color. Use strictly for critical telemetry alerts, active navigation states, and primary call-to-actions.
- **Atmospheric Blue (#5AB8FF):** A secondary functional color reserved for planetary glows, orbital paths, and non-critical data visualizations.
- **High-Velocity White (#F7FBFF):** The primary content color for maximum legibility against the dark canvas.
- **Hairline Grey (rgba(255, 255, 255, 0.12)):** Used for structural boundaries, grid lines, and subtle separators to maintain technical organization without visual clutter.

## Typography

Typography is a critical component of the technical aesthetic. This design system utilizes a tri-font hierarchy:

1.  **Geist (Headlines/Display):** Chosen for its sharp, technical geometry and modern sans-serif structure. It conveys authority and precision.
2.  **Inter (Body/Interface):** Used for descriptive text and general UI elements to ensure high legibility and a neutral tone.
3.  **JetBrains Mono (Technical Labels/Data):** Every piece of telemetry, coordinate data, or timestamp must use this monospaced font. It reinforces the engineering-heavy nature of the platform.

**Editorial Tip:** Use "label-technical" for all small metadata. High letter-spacing (8%) is essential for these labels to maintain a professional, "blueprint" look.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for data density and a **Fluid Overlay** model for the planetary interface.

- **Grid:** A 12-column grid on desktop with 16px gutters. Telemetry panels should dock to the left or right 3-4 columns, leaving the center clear for the globe.
- **Rhythm:** An 8px linear scale (4px for micro-adjustments) ensures all technical components align perfectly.
- **Breakpoints:**
    - **Desktop (1440px+):** Full telemetry dashboard with multi-pane overlays.
    - **Tablet (768px - 1439px):** Collapsible sidebars, focused data view.
    - **Mobile (< 767px):** Single-column bottom sheet for data, maximizing globe visibility at the top.

## Elevation & Depth

Depth is not communicated through shadows, but through **Tonal Layers** and **Backdrop Blurs**.

- **Level 0 (Base):** The #050914 canvas.
- **Level 1 (Panels):** Glassmorphic surfaces (rgba(10, 12, 18, 0.72)) with a 20px backdrop-blur. This creates a "heads-up display" (HUD) effect over the globe.
- **Level 2 (Active Elements):** High-contrast outlines using the Hairline Grey (12% white).
- **Highlights:** No heavy drop shadows are allowed. If a pop-over is required, use a 1px solid border (#F7FBFF at 20% opacity) and a darker 80% opaque background to separate it from Level 1.

## Shapes

The shape language is rigid and architectural.

- **Corner Radius:** Standard components (buttons, cards, panels) use a **4px** radius (Soft/1). This provides a modern touch without looking friendly or "bubbly."
- **Interactive Elements:** Checkboxes and toggle tracks remain at a sharp 2px or 4px radius.
- **Full Radius:** Only used for status indicators (LED pips) and circular map markers.

## Components

### Buttons & Interaction
- **Primary:** Solid #E10600 with white text. No gradients.
- **Secondary/Ghost:** 1px hairline border with transparent background. On hover, the background fills to 10% white.
- **States:** Active states are indicated by a 2px left-border accent in Racing Red.

### Data Panels (Cards)
- All panels must use the glassmorphic background and 1px hairline border.
- Panel headers should use the "label-technical" typography style with a subtle 1px bottom border.

### Telemetry Lists
- Lists are borderless but separated by 1px hairlines.
- Values should be right-aligned using "mono-data" for vertical alignment of decimal points.

### Input Fields
- Underline-only or 1px bordered boxes. Backgrounds should be slightly darker than the panel background (rgba(0,0,0,0.2)).
- Focus state: Border color changes to Racing Red.

### Map Markers
- Use the Atmospheric Blue (#5AB8FF) for location pips.
- Selected markers pulse with a Racing Red ring and display a glassmorphic tooltip with technical coordinates.
