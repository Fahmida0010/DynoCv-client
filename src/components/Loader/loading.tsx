import { useEffect } from "react";
import { spiral } from "ldrs";

spiral.register();

const Loading = () => {
  useEffect(() => {
    spiral.register();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <l-spiral
        size="60"
        speed="0.9"
        color="#16a34a"
      ></l-spiral>
    </div>
  );
};

export default Loading;