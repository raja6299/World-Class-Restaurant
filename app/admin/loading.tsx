export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
      <p className="text-zinc-400 font-serif animate-pulse">Loading workspace...</p>
    </div>
  );
}
