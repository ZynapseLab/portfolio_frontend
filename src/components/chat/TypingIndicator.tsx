export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-th-bg-subtle px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-th-text-faint [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-th-text-faint [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-th-text-faint [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
