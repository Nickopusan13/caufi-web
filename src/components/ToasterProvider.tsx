import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={true}
      toastOptions={{ duration: 1500 }}
    />
  );
}
