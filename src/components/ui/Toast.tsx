export default function Toast({ message }: { message: string }) {
  return (
    <div className="absolute bottom-4 left-1/2 z-40 -translate-x-1/2 animate-fade-in rounded-xl border border-emerald-300/40 bg-emerald-600/95 px-4 py-2 text-sm font-semibold text-white shadow-xl backdrop-blur">
      {message}
    </div>
  );
}
