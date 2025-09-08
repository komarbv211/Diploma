const ClearIcon: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <span onClick={onClick} className="cursor-pointer ml-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M2 2L18 18M2 18L18 2" stroke="#666666" />
    </svg>
  </span>
);

export default ClearIcon;
