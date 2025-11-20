import styles from "./icons.module.css";

interface Props {
  text: string;
  className?: string;
  isUserLogo?: boolean;
}

export const Logo = ({ text, className, isUserLogo = false }: Props) => {
  if (isUserLogo) {
    return (
      <div className={styles.logoUserMenu}>
        <div>
          <p className={className || ""}>{text}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className={styles.logo}>
        <div>
          <p className={className || ""}>{text}</p>
        </div>
      </div>
    );
  }
};
