type Props = {
  error: Error;
  onRetry: () => void;
};

export default function Error({ error, onRetry }: Props) {
  return (
    <div className="flex flex-col gap-4 items-center text-center bg-white p-10 rounded-lg shadow-md">

      <span
        data-testid="error-message"
        className="text-lg"
      >
        {error.message}
      </span>

      <button
        data-testid="retry-button"
        onClick={onRetry}
        className="px-4"
      >
        Retry
      </button>
    </div>
  );
}