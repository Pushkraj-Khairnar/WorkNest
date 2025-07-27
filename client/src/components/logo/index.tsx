const Logo = ({ size = "h-6 w-6" }: { size?: string }) => {
  return (
    <div className={`flex ${size} items-center justify-center`}>
      <img 
        src="/images/logo.png" 
        alt="WorkNest Logo" 
        className={`${size} object-contain`}
      />
    </div>
  );
};

export default Logo;
