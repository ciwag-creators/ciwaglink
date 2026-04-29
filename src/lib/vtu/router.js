import { cheapAirtime } from "@/lib/vtu/cheapdatahub";
import { iCafeAirtime } from "@/lib/vtu/iacafe";

export async function processAirtime(payload) {
  try {
    const res = await cheapAirtime(payload);
    return { provider: "cheapdatahub", response: res };
  } catch (err) {
    const fallback = await iCafeAirtime({
      request_id: `fallback_${Date.now()}`,
      phone: payload.phone,
      service_id: payload.service_id || "mtn",
      amount: payload.amount
    });

    return { provider: "iacafe", response: fallback };
  }
}