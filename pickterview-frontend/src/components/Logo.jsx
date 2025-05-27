import React from "react";
import pickterviewLogo from "/images/pickterview.png";

function Logo({ className }) {
  return (
    <img src={pickterviewLogo} alt="Pickterview Logo" className={className} />
  );
}

export default Logo;
