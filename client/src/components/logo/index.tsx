import { Link } from "react-router-dom";

const Logo = (props: { url?: string }) => {
  const { url = "/" } = props;
  return (
    <div className="flex items-center justify-center sm:justify-start">
      <Link to={url} className="flex items-center gap-2">
        <img
          src="/images/logo.jpeg"
          alt="WorkNest Logo"
          className="h-8 w-8 object-contain"
        />
        <span className="ml-1 text-xl font-semibold tracking-tight text-slate-700 dark:text-white select-none">
          WorkNest
        </span>
      </Link>
    </div>
  );
};

export default Logo;
