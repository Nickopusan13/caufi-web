import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={true}
      toastOptions={{
        duration: 1500,
        style: {
          animation: "slide-in 0.2s ease-out",
        },
      }}
    />
  );
}
