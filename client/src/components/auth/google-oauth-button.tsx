import { baseURL } from "@/lib/base-url";
import { Button } from "../ui/button";

const GoogleOauthButton = (props: { label: string }) => {
  const { label } = props;

  const handleClick = () => {
    const googleAuthUrl = `${baseURL}/api/auth/google`;
    window.location.href = googleAuthUrl;
  };
  
  return (
    <Button
      onClick={handleClick}
      variant="outline"
      type="button"
      className="w-full h-12 bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-200 hover:shadow-lg"
    >
      <svg 
        className="w-5 h-5 mr-3" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
      >
        <path
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
          fill="currentColor"
        />
      </svg>
      {label} with Google
    </Button>
  );
};

export default GoogleOauthButton;
