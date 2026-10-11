import Spinner from "@/presentation/components/spinner/spinner";

export default function LoadingScreen() {
  return (
    <div
      data-testid="loading-screen"
      className="flex items-center justify-center bg-white/80 fixed inset-0 cursor-wait"
    >
      <div className="flex flex-col items-center justify-center bg-black/90 w-80 h-40 rounded-lg">
        <span className="text-base mb-2 text-white">Loading...</span>
        <Spinner />
      </div>
    </div>
  );
}