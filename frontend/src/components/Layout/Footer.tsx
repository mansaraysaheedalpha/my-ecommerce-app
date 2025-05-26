import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 text-slate-600 py-8 mt-12">
      {/* Light gray background, padding, margin-top */}
      <div className="container mx-auto px-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} ShopSphere by Saheed. All rights
          reserved.
        </p>
        <p className="text-sm mt-1">Modern E-commerce Experience</p>
      </div>
    </footer>
  );
};

export default Footer;
