import { ButtonProps } from "../../types/index";
const Btn = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`bg-accent text-white rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Btn;
