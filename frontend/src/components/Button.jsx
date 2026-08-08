function Button({ children, type = "button", onClick, variant = "primary" }) {
  const baseStyles =
    "rounded-md px-5 py-2.5 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300";

  const variants = {
    primary: "bg-amber-200 text-emerald-950 hover:bg-amber-100",
    secondary:
      "border border-amber-200/60 text-amber-100 hover:bg-amber-200 hover:text-emerald-950",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

export default Button;
