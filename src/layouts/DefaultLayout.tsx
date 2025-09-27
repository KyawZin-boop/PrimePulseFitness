import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
