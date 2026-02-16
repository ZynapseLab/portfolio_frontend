export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-surface-800 px-4 py-3 light:bg-surface-100">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-surface-500 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-surface-500 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-surface-500 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
