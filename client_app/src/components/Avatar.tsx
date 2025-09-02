// src/components/Avatar.tsx
import React, { useState } from "react";
import { APP_ENV } from "../env";

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  image?: string;
  size?: number; // розмір аватара в px
  className?: string; // додаткові класи Tailwind
}

const getInitials = (firstName?: string, lastName?: string) => {
  const f = firstName?.[0] ?? "";
  const l = lastName?.[0] ?? "";
  return (f + l).toUpperCase();
};

const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  image,
  size = 50,
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(firstName, lastName);

  const style = { width: size, height: size, fontSize: size / 2.2 };

  return !image || imgError ? (
    <div
      style={style}
      className={`rounded-full bg-cream text-gray flex items-center justify-center font-semibold ${className}`}
    >
      {initials}
    </div>
  ) : (
    <img
      src={`${APP_ENV.IMAGES_200_URL}${image}`}
      alt={firstName || "User"}
      style={style}
      className={`rounded-full object-cover ${className}`}
      onError={() => setImgError(true)}
    />
  );
};

export default Avatar;
