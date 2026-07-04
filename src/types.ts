// ---- Option-table entries ----
export interface Option {
  k: string;
  label: string; // Hinglish chip text
  en: string; // design-English injected into prompts
  hex?: string; // colours only
  custom?: boolean;
}

// ---- Domain state ----
export interface Ref {
  img: string;
  use: string;
}

export interface LogEntry {
  when: string;
  txt: string;
}

export interface Room {
  name: string;
  size: string;
  windows: string;
  sun: string;
  fixed: string;
  reqs: string[];
  free: string;
  refs: Ref[];
  log: LogEntry[];
}

export interface Bible {
  vibe: string;
  wall: string; // "" = designer decides
  floor: string; // "" = neutral / designer decides
  colors: string[];
  light: string;
  avoid: string[];
  notes: string;
  customColors: Option[];
  customAvoid: Option[];
  customLights: Option[];
}

export interface House {
  globals: string;
  climate: string;
  area: string;
  plan: string; // base64 jpeg
}

export type Aspect = "landscape" | "portrait" | "square";

export interface State {
  bible: Bible;
  house: House;
  camera: string;
  aspect: Aspect;
  customReqs: Option[];
  rooms: Room[];
}
