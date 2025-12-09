import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mb-6 text-6xl">🔍</div>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Dieses Unternehmen ist leider noch nicht bei Beyond925
        </h1>
        <p className="mb-8 text-gray-600">
          Das von dir gesuchte Unternehmen konnte nicht gefunden werden.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
