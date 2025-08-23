interface Props {
  onClick: VoidFunction;
}

export const SendButton = ({ onClick }: Props) => {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer"
      onClick={onClick}
      type="submit"
    >
      Send
    </button>
  );
};
