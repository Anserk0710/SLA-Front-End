import axios from "axios";
import { apiBaseUrl } from "../api/axios";

type ApiErrorPayload = {
  detail?: unknown;
  message?: unknown;
};

function pickReadableMessage(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  return text.length > 0 ? text : null;
}

function getServerErrorMessage(payload: unknown): string | null {
  if (typeof payload === "string") {
    return pickReadableMessage(payload);
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as ApiErrorPayload;
  return pickReadableMessage(data.detail) ?? pickReadableMessage(data.message);
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(error)) {
    const detailMessage = getServerErrorMessage(error.response?.data);
    if (detailMessage) {
      return detailMessage;
    }

    if (error.code === "ECONNABORTED") {
      return error.message;
    }

    if (!error.response) {
      return `Backend tidak merespons. Periksa koneksi jaringan atau pastikan server aktif di ${apiBaseUrl}.`;
    }

    const axiosMessage = pickReadableMessage(error.message);
    if (axiosMessage) {
      return axiosMessage;
    }
  }

  if (error instanceof Error) {
    const genericMessage = pickReadableMessage(error.message);
    if (genericMessage) {
      return genericMessage;
    }
  }

  return fallbackMessage;
}
