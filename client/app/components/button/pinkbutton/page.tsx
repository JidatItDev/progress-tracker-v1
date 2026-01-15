"use client";
const ButtonPink = ({
  buttonname,
  className,
  onClick,
}: {
  buttonname: string;
  className: string;
  onClick: () => void;
}) => {
  return (
    <button className={className} onClick={onClick}>
      {buttonname}{" "}
    </button>
  );
};

export default ButtonPink;
