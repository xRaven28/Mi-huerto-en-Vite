import React from "react";

interface StarRatingProps {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 20,
}) => {
  const estrellas = [1, 2, 3, 4, 5];

  return (
    <div className="d-flex justify-content-center align-items-center gap-1">
      {estrellas.map((num) => (
        <i
          key={num}
          className={`bi ${num <= value ? "bi-star-fill" : "bi-star"}`}
          style={{
            color: "#FFD700",
            fontSize: `${size}px`,
            cursor: readOnly ? "default" : "pointer",
            transition: "transform 0.2s ease",
          }}
          onClick={() => !readOnly && onChange && onChange(num)}
          onMouseOver={(e) =>
            !readOnly && ((e.target as HTMLElement).style.transform = "scale(1.2)")
          }
          onMouseOut={(e) =>
            !readOnly && ((e.target as HTMLElement).style.transform = "scale(1)")
          }
        />
      ))}
    </div>
  );
};

export default StarRating;
