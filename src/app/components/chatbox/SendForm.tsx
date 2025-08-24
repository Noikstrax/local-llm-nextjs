import { InputFiled } from "./InputField";
import { SendButton } from "./SendButton";

interface Props {
  handleSend: () => void;
  newMessage: string;
  onChange: (newMessage: string) => void;
}

export const SendForm = ({ handleSend, newMessage, onChange }: Props) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSend();
      }}
      className="flex space-between w-full"
    >
      <input
        className="border px-2 py-1 rounded w-full"
        value={newMessage}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer"
        type="submit"
      >
        Send
      </button>
    </form>
  );
};
