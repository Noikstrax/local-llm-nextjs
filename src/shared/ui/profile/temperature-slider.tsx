import { cn } from "@/lib/utils";
import { Slider } from "../slider";

type SliderProps = Omit<
  React.ComponentProps<typeof Slider>,
  "value" | "onValueChange" | "defaultValue"
> & {
  value?: number;
  onChange?: (value: number) => void;
};
export function TemperatureSlider({
  className,
  value = 0.5,
  onChange,
  ...props
}: SliderProps) {
  return (
    <div>
      <div className="text-center">{value.toFixed(1)}</div>
      <Slider
        value={[value]}
        max={1}
        step={0.1}
        className={cn("w-full bg-gray-500", className)}
        {...props}
        onValueChange={(value: number[]) => {
          onChange?.(value[0]);
        }}
      />
    </div>
  );
}
