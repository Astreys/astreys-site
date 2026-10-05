interface GoatCounter {
  count?: (vars: { path?: string; title?: string; event?: boolean }) => void;
  no_onload?: boolean;
}

interface Window {
  goatcounter?: GoatCounter;
}
