import { ButtonProps } from '../../types/index'
const Btn = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button className={`bg-accent rounded-lg ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Btn
