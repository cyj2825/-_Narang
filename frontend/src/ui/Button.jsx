const Button = (props) => {
  const { children, className, ...otherProps } = props;

  const defaultStyles = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

  return (
    <button className={`${defaultStyles} ${className}`} {...otherProps}>
      {children}
    </button>
  );
}
export default Button