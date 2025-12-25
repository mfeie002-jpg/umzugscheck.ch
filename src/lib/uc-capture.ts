export type UcCaptureFocus = "options" | "contact";

export interface UcCaptureParams {
  enabled: boolean;
  step: number | null;
  focus: UcCaptureFocus | null;
}

export function getUcCaptureParams(search: string): UcCaptureParams {
  try {
    const params = new URLSearchParams(search);
    const enabled = params.get("uc_capture") === "1";
    const stepRaw = params.get("uc_step");
    const step = stepRaw ? Number(stepRaw) : null;
    const focusRaw = params.get("uc_focus");
    const focus = focusRaw === "options" || focusRaw === "contact" ? focusRaw : null;

    return {
      enabled,
      step: Number.isFinite(step) ? step : null,
      focus,
    };
  } catch {
    return { enabled: false, step: null, focus: null };
  }
}

export function getTomorrowISODate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

export function getDefaultCaptureContact() {
  return {
    name: "Max Muster",
    email: "max.muster@example.ch",
    phone: "+41 79 123 45 67",
  };
}
