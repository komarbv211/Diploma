import { useGoogleLogin } from "@react-oauth/google";
import styles from "../buttons/googleButton.module.scss";
import { LoginButtonProps } from "../../types/account";

const GoogleLoginButton: React.FC<LoginButtonProps> = ({
  onLogin,
  title,
  icon,
}) => {
  const login = useGoogleLogin({
    onSuccess: (authCodeResponse) => {
      console.log("Login Google Token", authCodeResponse.access_token);
      onLogin(authCodeResponse.access_token);
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    <button
      className={styles.googleButton}
      onClick={() => login()}
      type="button"
    >
      <span className={styles.googleButtonIcon}>{icon}</span>
      <span className={styles.googleButtonText}>{title}</span>
    </button>
  );
};

export default GoogleLoginButton;
