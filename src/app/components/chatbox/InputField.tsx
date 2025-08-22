interface Props {
  value: string;
  onChange: (arg: string) => void;
}

export const InputFiled = ({ value, onChange }: Props) => {
  return (
    <input
      className="border px-2 py-1 rounded w-full"
      value={value}
      onInput={(e) => {
        onChange(e.currentTarget.value);
      }}
      placeholder="Type your message"
    />
  );
};
