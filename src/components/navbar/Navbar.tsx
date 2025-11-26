import Link from "next/link";
import { motion } from "motion/react";
import { CiSearch } from "react-icons/ci";
import { Input } from "../ui/input";
import ModeToggle from "./components/ModeToggle";
import MenuBar from "./components/MenuBar";
import SignRegBtn from "./components/SignRegBtn";

export default function Navbar() {
  return (
    <header className="fixed bg-zinc-600 z-100 w-full py-5 px-3 flex justify-center align-middle items-center">
      <div className="flex">
        <Link href="/">
          <h1 className="font-bold text-3xl font-love">CAUFI.</h1>
        </Link>
      </div>
      <Input />
      <SignRegBtn />
      <MenuBar />
      <ModeToggle />
    </header>
  );
}
