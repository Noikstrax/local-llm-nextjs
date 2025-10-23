import styles from "./icons.module.css";

interface Props {
  text: string;
}

export const Logo = ({ text }: Props) => {
  return (
    <div className={styles.logo}>
      <div>
        <p>{text}</p>
      </div>
    </div>
  );
};
