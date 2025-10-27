import styles from "./icons.module.css";

interface Props {
  text: string;
  className?: string;
}

export const Logo = ({ text, className }: Props) => {
  return (
    <div className={styles.logo}>
      <div>
        <p className={className || ""}>{text}</p>
      </div>
    </div>
  );
};
