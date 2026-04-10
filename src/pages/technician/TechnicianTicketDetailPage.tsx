import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import {
  getAssignedTicketDetail,
  submitCheckIn,
  submitResolution,
} from "../../api/technician.api";
import { reverseGeocodeCoordinates } from "../../api/location.api";
import InternalStatusBadge from "../../components/status/InternalStatusBadge";
import { getApiErrorMessage } from "../../lib/api-error";
import { logError } from "../../lib/logger";
import type { TechnicianTicketDetail } from "../../types/technician-ticket";

function formatDateTime(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleString("id-ID");
}

type Coordinates = {
  latitude: string;
  longitude: string;
};

type CameraFacingMode = "user" | "environment";

function stopStream(stream: MediaStream | null) {
  if (!stream) return;
  stream.getTracks().forEach((track) => track.stop());
}

function toggleFacingMode(current: CameraFacingMode): CameraFacingMode {
  return current === "user" ? "environment" : "user";
}

async function getCameraStream(facingMode: CameraFacingMode) {
  const attempts: Array<MediaTrackConstraints | boolean> = [
    { facingMode: { exact: facingMode } },
    { facingMode: { ideal: facingMode } },
    { facingMode },
    true,
  ];

  let lastError: unknown = null;

  for (const videoConstraint of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia({
        video: videoConstraint,
        audio: false,
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Tidak dapat mengakses kamera.");
}

async function attachStreamToPreview(
  preview: HTMLVideoElement | null,
  stream: MediaStream
) {
  if (!preview) return;

  preview.srcObject = stream;
  await preview.play();
}

function getErrorDetail(error: unknown, fallbackMessage: string) {
  return getApiErrorMessage(error, fallbackMessage);
}

function getCurrentCoordinates(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Browser Anda tidak mendukung geolocation."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        });
      },
      (error) => {
        logError(error);
        reject(new Error("Gagal mengambil lokasi. Pastikan izin lokasi diberikan."));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      }
    );
  });
}

export default function TechnicianTicketDetailPage() {
  const params = useParams();
  const ticketId = params.ticketId ?? "";
  const validTicketId = useMemo(() => ticketId.trim().length > 0, [ticketId]);

  const [ticket, setTicket] = useState<TechnicianTicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkinPreviewRef = useRef<HTMLVideoElement | null>(null);
  const checkinStreamRef = useRef<MediaStream | null>(null);
  const [checkinCameraOpen, setCheckinCameraOpen] = useState(false);
  const [checkinFacingMode, setCheckinFacingMode] = useState<CameraFacingMode>("user");

  const resolutionPreviewRef = useRef<HTMLVideoElement | null>(null);
  const resolutionStreamRef = useRef<MediaStream | null>(null);
  const resolutionRecorderRef = useRef<MediaRecorder | null>(null);
  const resolutionChunksRef = useRef<Blob[]>([]);
  const [resolutionCameraOpen, setResolutionCameraOpen] = useState(false);
  const [resolutionFacingMode, setResolutionFacingMode] =
    useState<CameraFacingMode>("user");
  const [resolutionRecording, setResolutionRecording] = useState(false);

  const [checkinAddress, setCheckinAddress] = useState("");
  const [checkinNotes, setCheckinNotes] = useState("");
  const [checkinPhoto, setCheckinPhoto] = useState<File | null>(null);
  const [checkinPhotoPreviewUrl, setCheckinPhotoPreviewUrl] = useState<string | null>(null);
  const [checkinProgress, setCheckinProgress] = useState(0);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [checkinAddressLoading, setCheckinAddressLoading] = useState(false);

  const [resolutionAddress, setResolutionAddress] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const [resolutionVideo, setResolutionVideo] = useState<File | null>(null);
  const [resolutionVideoPreviewUrl, setResolutionVideoPreviewUrl] = useState<string | null>(null);
  const [resolutionProgress, setResolutionProgress] = useState(0);
  const [resolutionLoading, setResolutionLoading] = useState(false);
  const [resolutionAddressLoading, setResolutionAddressLoading] = useState(false);

  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const loadDetail = useCallback(async () => {
    if (!validTicketId) return;

    try {
      setLoading(true);
      setError("");
      const data = await getAssignedTicketDetail(ticketId);
      setTicket(data);
    } catch (err) {
      logError(err);
      setError(getApiErrorMessage(err, "Gagal memuat detail ticket technician."));
    } finally {
      setLoading(false);
    }
  }, [ticketId, validTicketId]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  useEffect(() => {
    if (!checkinPhoto) {
      setCheckinPhotoPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(checkinPhoto);
    setCheckinPhotoPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [checkinPhoto]);

  useEffect(() => {
    if (!resolutionVideo) {
      setResolutionVideoPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(resolutionVideo);
    setResolutionVideoPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [resolutionVideo]);

  useEffect(() => {
    const preview = checkinPreviewRef.current;
    if (!preview || !checkinCameraOpen || !checkinStreamRef.current) return;

    preview.srcObject = checkinStreamRef.current;
    void preview.play().catch((err) => {
      logError(err);
      setActionError("Gagal menampilkan preview kamera.");
    });
  }, [checkinCameraOpen]);

  useEffect(() => {
    const preview = resolutionPreviewRef.current;
    if (!preview || !resolutionCameraOpen || !resolutionStreamRef.current) return;

    preview.srcObject = resolutionStreamRef.current;
    void preview.play().catch((err) => {
      logError(err);
      setActionError("Gagal menampilkan preview kamera.");
    });
  }, [resolutionCameraOpen]);

  useEffect(() => {
    if (!checkinCameraOpen && !resolutionCameraOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [checkinCameraOpen, resolutionCameraOpen]);

  useEffect(() => {
    return () => {
      stopStream(checkinStreamRef.current);
      stopStream(resolutionStreamRef.current);
    };
  }, []);

  function closeCheckinCamera() {
    const preview = checkinPreviewRef.current;
    if (preview) {
      preview.srcObject = null;
    }
    stopStream(checkinStreamRef.current);
    checkinStreamRef.current = null;
    setCheckinCameraOpen(false);
  }

  async function openCheckinCamera(facingMode: CameraFacingMode = checkinFacingMode) {
    setActionError("");
    setActionMessage("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setActionError("Browser tidak mendukung akses kamera.");
      return;
    }

    let stream: MediaStream | null = null;

    try {
      stopStream(checkinStreamRef.current);

      stream = await getCameraStream(facingMode);

      checkinStreamRef.current = stream;
      setCheckinFacingMode(facingMode);
      setCheckinCameraOpen(true);
      await attachStreamToPreview(checkinPreviewRef.current, stream);
    } catch (err) {
      stopStream(stream);
      checkinStreamRef.current = null;
      setCheckinCameraOpen(false);
      logError(err);
      setActionError(
        "Kamera gagal dibuka. Pastikan izin kamera diaktifkan, lalu coba lagi."
      );
    }
  }

  async function switchCheckinCamera() {
    await openCheckinCamera(toggleFacingMode(checkinFacingMode));
  }

  async function captureCheckinPhoto() {
    const preview = checkinPreviewRef.current;
    if (!preview) {
      setActionError("Preview kamera belum siap.");
      return;
    }

    const canvas = document.createElement("canvas");
    const width = preview.videoWidth || 1280;
    const height = preview.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      setActionError("Gagal mengakses canvas untuk mengambil foto.");
      return;
    }

    context.drawImage(preview, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!blob) {
      setActionError("Gagal mengambil foto dari kamera.");
      return;
    }

    const file = new File([blob], `checkin-${Date.now()}.jpg`, {
      type: "image/jpeg",
    });

    setCheckinPhoto(file);
    closeCheckinCamera();
    await fillAddressFromCurrentLocation(
      "checkin",
      "Foto berhasil diambil dan alamat check-in terisi otomatis dari lokasi saat ini."
    );
  }

  function closeResolutionCamera() {
    const recorder = resolutionRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.stop();
      return;
    }

    const preview = resolutionPreviewRef.current;
    if (preview) {
      preview.srcObject = null;
    }

    stopStream(resolutionStreamRef.current);
    resolutionStreamRef.current = null;
    resolutionRecorderRef.current = null;
    setResolutionRecording(false);
    setResolutionCameraOpen(false);
  }

  async function openResolutionCamera(
    facingMode: CameraFacingMode = resolutionFacingMode
  ) {
    setActionError("");
    setActionMessage("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setActionError("Browser tidak mendukung akses kamera.");
      return;
    }

    let stream: MediaStream | null = null;

    try {
      stopStream(resolutionStreamRef.current);

      stream = await getCameraStream(facingMode);

      resolutionStreamRef.current = stream;
      setResolutionFacingMode(facingMode);
      setResolutionCameraOpen(true);
      await attachStreamToPreview(resolutionPreviewRef.current, stream);
    } catch (err) {
      stopStream(stream);
      resolutionStreamRef.current = null;
      setResolutionCameraOpen(false);
      logError(err);
      setActionError(
        "Kamera gagal dibuka. Pastikan izin kamera diaktifkan, lalu coba lagi."
      );
    }
  }

  async function switchResolutionCamera() {
    if (resolutionRecording) return;
    await openResolutionCamera(toggleFacingMode(resolutionFacingMode));
  }

  function startResolutionRecording() {
    if (!resolutionStreamRef.current) {
      setActionError("Preview kamera belum siap.");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setActionError("Browser tidak mendukung perekaman video.");
      return;
    }

    const preferredTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];

    const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type));

    const recorder = mimeType
      ? new MediaRecorder(resolutionStreamRef.current, { mimeType })
      : new MediaRecorder(resolutionStreamRef.current);

    resolutionChunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        resolutionChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(resolutionChunksRef.current, {
        type: recorder.mimeType || "video/webm",
      });

      if (blob.size > 0) {
        const file = new File([blob], `resolution-${Date.now()}.webm`, {
          type: blob.type || "video/webm",
        });
        setResolutionVideo(file);
      }

      const preview = resolutionPreviewRef.current;
      if (preview) {
        preview.srcObject = null;
      }

      stopStream(resolutionStreamRef.current);
      resolutionStreamRef.current = null;
      resolutionRecorderRef.current = null;
      setResolutionRecording(false);
      setResolutionCameraOpen(false);
    };

    resolutionRecorderRef.current = recorder;
    setResolutionRecording(true);
    recorder.start();
  }

  function stopResolutionRecording() {
    const recorder = resolutionRecorderRef.current;
    if (!recorder || recorder.state !== "recording") return;
    recorder.stop();
  }

  async function fillAddressFromCurrentLocation(
    target: "checkin" | "resolution",
    successMessage: string
  ) {
    const setLoading =
      target === "checkin" ? setCheckinAddressLoading : setResolutionAddressLoading;
    const setAddress =
      target === "checkin" ? setCheckinAddress : setResolutionAddress;

    try {
      setLoading(true);
      setActionError("");
      setActionMessage("");

      const coordinates = await getCurrentCoordinates();
      const fullAddress = await reverseGeocodeCoordinates(coordinates);

      setAddress(fullAddress);
      setActionMessage(successMessage);
    } catch (err: unknown) {
      logError(err);
      setActionError(
        getErrorDetail(err, "Gagal mengambil alamat lengkap dari lokasi saat ini.")
      );
    } finally {
      setLoading(false);
    }
  }

  async function autofillAddress(target: "checkin" | "resolution") {
    await fillAddressFromCurrentLocation(
      target,
      "Alamat lengkap berhasil diisi otomatis dari lokasi saat ini."
    );
  }

  async function handleCheckInSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ticket) return;
    if (!checkinAddress.trim()) {
      setActionError("Alamat check-in wajib diisi.");
      return;
    }
    if (!checkinPhoto) {
      setActionError("Foto kedatangan wajib diambil dari kamera.");
      return;
    }

    try {
      setCheckinLoading(true);
      setCheckinProgress(0);
      setActionError("");
      setActionMessage("");

      const coordinates = await getCurrentCoordinates();

      const formData = new FormData();
      formData.append("latitude", coordinates.latitude);
      formData.append("longitude", coordinates.longitude);
      formData.append("address", checkinAddress.trim());
      formData.append("notes", checkinNotes);
      formData.append("photo", checkinPhoto);

      const result = await submitCheckIn(ticket.id, formData, setCheckinProgress);
      setActionMessage(result.message);
      setCheckinAddress("");
      setCheckinNotes("");
      setCheckinPhoto(null);
      await loadDetail();
    } catch (err: unknown) {
      logError(err);
      setActionError(getErrorDetail(err, "Gagal menyimpan check-in."));
    } finally {
      setCheckinLoading(false);
    }
  }

  async function handleResolutionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ticket) return;
    if (!ticket.checkin) {
      setActionError("Check-in harus dilakukan terlebih dahulu.");
      return;
    }
    if (!resolutionAddress.trim()) {
      setActionError("Alamat submit selesai wajib diisi.");
      return;
    }
    if (resolutionNote.trim().length < 3) {
      setActionError("Catatan penyelesaian minimal 3 karakter.");
      return;
    }
    if (!resolutionVideo) {
      setActionError("Video bukti selesai wajib direkam dari kamera.");
      return;
    }

    try {
      setResolutionLoading(true);
      setResolutionProgress(0);
      setActionError("");
      setActionMessage("");

      const coordinates = await getCurrentCoordinates();

      const formData = new FormData();
      formData.append("latitude", coordinates.latitude);
      formData.append("longitude", coordinates.longitude);
      formData.append("address", resolutionAddress.trim());
      formData.append("resolution_note", resolutionNote);
      formData.append("video", resolutionVideo);

      const result = await submitResolution(ticket.id, formData, setResolutionProgress);
      setActionMessage(result.message);
      setResolutionAddress("");
      setResolutionNote("");
      setResolutionVideo(null);
      await loadDetail();
    } catch (err: unknown) {
      logError(err);
      setActionError(getErrorDetail(err, "Gagal menyimpan bukti selesai."));
    } finally {
      setResolutionLoading(false);
    }
  }

  if (!validTicketId) {
    return (
      <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        Ticket ID tidak valid.
      </div>
    );
  }

  if (loading) {
    return <div className="text-sm text-slate-500">Memuat detail ticket...</div>;
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error || "Ticket tidak ditemukan."}
        </div>
        <Link
          to="/technician"
          className="inline-block rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
        >
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-500">Detail Ticket</p>
          <h2 className="text-2xl font-bold">{ticket.ticket_code}</h2>
        </div>

        <div className="flex items-center gap-3">
          <InternalStatusBadge status={ticket.internal_status} />
          <Link
            to="/technician"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Kembali
          </Link>
        </div>
      </div>

      {actionMessage ? (
        <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {actionMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {actionError}
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 p-5">
        <h3 className="text-lg font-bold">Informasi Ticket</h3>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Pelapor</p>
            <p className="font-semibold">{ticket.full_name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">PIC</p>
            <p className="font-semibold">{ticket.pic_name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Kategori</p>
            <p className="font-semibold">{ticket.category}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Nomor HP</p>
            <p className="font-semibold">{ticket.phone_number}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Alamat Pelapor</p>
            <p className="font-semibold">{ticket.full_address}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-slate-500">Deskripsi Kendala</p>
            <p className="font-semibold">{ticket.description}</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-lg font-bold">Check-in Form</h3>
          <p className="mt-1 text-sm text-slate-500">
            Kamera depan dibuka otomatis. Anda bisa ganti kamera jika diperlukan.
            Saat dibuka, kamera tampil penuh di seluruh layar.
          </p>

          {ticket.checkin ? (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm">
              <p className="font-medium">Check-in sudah tersimpan.</p>
              <img
                src={ticket.checkin.photo_secure_url}
                alt="Check-in"
                className="mt-3 h-56 w-full rounded-lg object-cover"
              />
              <div className="mt-3 space-y-1">
                <p><span className="text-slate-500">Alamat:</span> {ticket.checkin.address}</p>
                <p><span className="text-slate-500">Server Timestamp:</span> {formatDateTime(ticket.checkin.server_timestamp)}</p>
                <p><span className="text-slate-500">Catatan:</span> {ticket.checkin.notes || "-"}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckInSubmit} className="mt-4 space-y-4">
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={checkinAddress}
                onChange={(e) => setCheckinAddress(e.target.value)}
                placeholder="Tulis alamat / patokan lokasi check-in"
              />
              <p className="text-xs text-slate-500">
                Setelah menekan `Ambil Foto`, alamat check-in akan terisi otomatis dari
                lokasi saat ini. Anda tetap bisa mengeditnya bila diperlukan.
              </p>

              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={checkinNotes}
                onChange={(e) => setCheckinNotes(e.target.value)}
                placeholder="Catatan check-in (opsional)"
              />

              {!checkinCameraOpen ? (
                <button
                  type="button"
                  onClick={() => {
                    void openCheckinCamera();
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Buka Kamera
                </button>
              ) : (
                <p className="text-xs text-slate-500">
                  Kamera sedang aktif di mode layar penuh.
                </p>
              )}

              <div>
                <p className="text-sm font-medium">Foto Kedatangan</p>
                {checkinPhotoPreviewUrl ? (
                  <img
                    src={checkinPhotoPreviewUrl}
                    alt="Preview Check-in"
                    className="mt-2 h-56 w-full rounded-lg border border-slate-200 object-cover"
                  />
                ) : (
                  <p className="mt-1 text-xs text-slate-500">Belum ada foto yang diambil.</p>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Alamat otomatis menggunakan data Geoapify dari lokasi saat ini.
              </p>

              {checkinAddressLoading ? (
                <p className="text-sm text-slate-500">
                  Mengambil alamat otomatis dari lokasi saat ini...
                </p>
              ) : null}

              {checkinLoading ? (
                <p className="text-sm text-slate-500">
                  Upload progress: {checkinProgress}%
                </p>
              ) : null}

              <button
                type="submit"
                disabled={checkinLoading || checkinAddressLoading}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {checkinLoading ? "Menyimpan..." : "Simpan Check-in"}
              </button>
            </form>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-lg font-bold">Submit Selesai</h3>
          <p className="mt-1 text-sm text-slate-500">
            Rekam video bukti pekerjaan. Lokasi akan diambil otomatis saat submit.
          </p>

          {ticket.resolution ? (
            <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm">
              <p className="font-medium">Bukti selesai sudah tersimpan.</p>
              <video
                src={ticket.resolution.video_secure_url}
                controls
                className="mt-3 w-full rounded-lg"
              />
              <div className="mt-3 space-y-1">
                <p><span className="text-slate-500">Alamat:</span> {ticket.resolution.address}</p>
                <p><span className="text-slate-500">Server Timestamp:</span> {formatDateTime(ticket.resolution.server_timestamp)}</p>
                <p><span className="text-slate-500">Catatan:</span> {ticket.resolution.resolution_note}</p>
              </div>
            </div>
          ) : !ticket.checkin ? (
            <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Form submit selesai akan tersedia setelah Anda melakukan check-in.
            </div>
          ) : (
            <form onSubmit={handleResolutionSubmit} className="mt-4 space-y-4">
              <textarea
                className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={resolutionAddress}
                onChange={(e) => setResolutionAddress(e.target.value)}
                placeholder="Tulis alamat / patokan lokasi submit selesai"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    void autofillAddress("resolution");
                  }}
                  disabled={resolutionAddressLoading}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-60"
                >
                  {resolutionAddressLoading
                    ? "Mengambil Alamat..."
                    : "Isi Alamat Otomatis"}
                </button>
                <p className="text-xs text-slate-500">
                  Ambil alamat lengkap sampai kode pos dan nama gedung jika tersedia.
                </p>
              </div>

              <textarea
                className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Tulis catatan penyelesaian pekerjaan"
              />

              {!resolutionCameraOpen ? (
                <button
                  type="button"
                  onClick={() => {
                    void openResolutionCamera();
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Buka Kamera
                </button>
              ) : (
                <p className="text-xs text-slate-500">
                  Kamera sedang aktif di mode layar penuh.
                </p>
              )}

              <div>
                <p className="text-sm font-medium">Video Bukti Selesai</p>
                {resolutionVideoPreviewUrl ? (
                  <video
                    src={resolutionVideoPreviewUrl}
                    controls
                    className="mt-2 w-full rounded-lg border border-slate-200"
                  />
                ) : (
                  <p className="mt-1 text-xs text-slate-500">Belum ada video yang direkam.</p>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Alamat otomatis menggunakan data Geoapify dari lokasi saat ini.
              </p>

              {resolutionLoading ? (
                <p className="text-sm text-slate-500">
                  Upload progress: {resolutionProgress}%
                </p>
              ) : null}

              <button
                type="submit"
                disabled={
                  resolutionLoading || resolutionRecording || resolutionAddressLoading
                }
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {resolutionLoading ? "Menyimpan..." : "Simpan Bukti Selesai"}
              </button>
            </form>
          )}
        </section>
      </div>

      {checkinCameraOpen ? (
        <div className="fixed inset-0 z-50 bg-black">
          <video
            ref={checkinPreviewRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="mx-auto flex w-full max-w-md flex-wrap justify-center gap-2 rounded-2xl bg-black/55 p-3 backdrop-blur">
              <button
                type="button"
                onClick={captureCheckinPhoto}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900"
              >
                Ambil Foto
              </button>
              <button
                type="button"
                onClick={switchCheckinCamera}
                className="rounded-lg border border-white/70 px-4 py-2 text-sm font-medium text-white"
              >
                Ganti Kamera
              </button>
              <button
                type="button"
                onClick={closeCheckinCamera}
                className="rounded-lg border border-white/70 px-4 py-2 text-sm font-medium text-white"
              >
                Tutup Kamera
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {resolutionCameraOpen ? (
        <div className="fixed inset-0 z-50 bg-black">
          <video
            ref={resolutionPreviewRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
            {resolutionRecording ? "Merekam..." : "Siap Merekam"}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="mx-auto flex w-full max-w-md flex-wrap justify-center gap-2 rounded-2xl bg-black/55 p-3 backdrop-blur">
              {!resolutionRecording ? (
                <button
                  type="button"
                  onClick={startResolutionRecording}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  Mulai Rekam
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopResolutionRecording}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Stop Rekam
                </button>
              )}
              <button
                type="button"
                onClick={switchResolutionCamera}
                disabled={resolutionRecording}
                className="rounded-lg border border-white/70 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                Ganti Kamera
              </button>
              <button
                type="button"
                onClick={closeResolutionCamera}
                disabled={resolutionRecording}
                className="rounded-lg border border-white/70 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                Tutup Kamera
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

