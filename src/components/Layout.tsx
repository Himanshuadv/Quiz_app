import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: "#050315",
    backgroundImage: `
      radial-gradient(circle at 50% 50%, rgba(20, 10, 40, 0.5) 0%, transparent 70%),
      url("data:image/svg+xml,%3Csvg width='60' height='60' ... %3C/svg%3E")
    `,
    backgroundSize: "100% 100%, 60px 60px",
    backgroundPosition: "center, 0 0",
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen text-white p-6"
      style={backgroundStyle}
    >
      {children}
    </div>
  );
};

export default Layout;
