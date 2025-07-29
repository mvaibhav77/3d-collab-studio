// Toolbar Frontend Module Declaration
declare module "mfe_toolbar/Toolbar" {
  const Toolbar: React.ComponentType;
  export default Toolbar;
}

// Canvas Frontend Module Declaration
declare module "mfe_canvas/Scene" {
  const Scene: React.ComponentType;
  export default Scene;
}

// Global CSS Module Declaration
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
