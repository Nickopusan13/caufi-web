import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import MyProfile from "@/components/profile/MyProfile";

export default function Profile() {
  return (
    <>
      <Navbar />
      <main className="bg-white/50 dark:bg-zinc-900 py-24">
        <MyProfile />
      </main>
      <Footer />
    </>
  );
}
