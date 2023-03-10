import * as Progress from '@radix-ui/react-progress';

interface IProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: IProgressBarProps) {
  return (
    <Progress.Root
      className="relative overflow-hidden rounded-xl bg-zinc-700 w-full h-3 mt-4"
      value={progress}
    >
      <Progress.Indicator
        className={`w-full h-full bg-blue-600 rounded-xl transition-transform`}
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </Progress.Root>
  );
}
