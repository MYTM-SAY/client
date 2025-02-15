import { ButtonProps } from "../../types/index";
const Btn = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={`bg-[#5647AE] rounded-lg ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Btn;
