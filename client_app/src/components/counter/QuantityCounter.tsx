import { useState } from "react";

function QuantityCounter({ initial = 1, className = "" }) {
  const [quantity, setQuantity] = useState(initial);

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div
      className={`relative w-[120px] h-12 ${className}`}
      style={{
        background: "linear-gradient(to bottom, #1A3D83, #8AA8D2)",
        padding: "1px",
        borderRadius: "12px",
      }}
    >
      <div className="flex justify-between items-center h-full bg-white rounded-[11px] px-3">
        <button type="button" onClick={decrease}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.16797 10H15.8346"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <span className="text-base">{quantity}</span>

        <button type="button" onClick={increase}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M4.16797 9.99999H10.0013M10.0013 9.99999H15.8346M10.0013 9.99999V4.16666M10.0013 9.99999V15.8333"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default QuantityCounter;
