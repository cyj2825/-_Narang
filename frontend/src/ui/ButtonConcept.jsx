const ButtonConcept = (props) => {
    const { children, className, ...otherProps  } = props;
  
    const defaultStyles = `text-white font-bold py-2 px-4 rounded-lg shadow-md`;
  
    return (
      <button className={`${defaultStyles} ${className}`} {...otherProps}>
        {children}
      </button>
    );
  }
  export default ButtonConcept