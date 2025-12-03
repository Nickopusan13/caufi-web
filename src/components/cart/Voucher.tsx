// "use client";

// import { motion } from "framer-motion";
// import { availableVouchers } from "./Item";
// import { create } from "zustand";

// export default function VoucherCard({
//   setOpenVoucher,
// }: {
//   setOpenVoucher: (open: boolean) => void;
// }) {
//   const { addVoucher } = useVoucherStore();
//   return (
//     <>
//       <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden p-5 max-h-100 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 rounded-lg">
//         {availableVouchers.map((item, index) => {
//           return (
//             <motion.div
//               key={index}
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.97 }}
//               transition={{ type: "spring", stiffness: 250, damping: 20 }}
//               onClick={() => {
//                 addVoucher(item);
//                 setOpenVoucher(false);
//               }}
//               className="flex items-center gap-4 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-700 dark:to-zinc-800 rounded-2xl shadow-md hover:shadow-xl p-5 border border-gray-200 dark:border-zinc-600 cursor-pointer transition-all duration-100"
//             >
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold dark:text-gray-900 text-gray-800">
//                   {item.title}
//                 </h3>
//                 <p className="text-sm text-gray-500">Use code:</p>
//                 <p className="text-md font-mono bg-gray-100 dark:bg-zinc-500 dark:text-gray-800 px-2 py-0.5 rounded-[10px] inline-block text-gray-800">
//                   {item.code}
//                 </p>
//               </div>
//               <div className="text-center">
//                 <p className="text-2xl font-bold text-pink-500">
//                   {item.discount}%
//                 </p>
//                 <p className="text-xs text-gray-400">OFF</p>
//                 <p className="text-[10px] text-gray-400 mt-1">
//                   Valid until {item.expiryDate}
//                 </p>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//       <div className="text-center mt-5">
//         <motion.button
//           whileHover={{ scale: 1.03 }}
//           whileTap={{ scale: 0.97 }}
//           transition={{ type: "spring", stiffness: 200, damping: 15 }}
//           onClick={() => {
//             addVoucher(null);
//             setOpenVoucher(false);
//           }}
//           className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//         >
//           Continue without Voucher
//         </motion.button>
//       </div>
//     </>
//   );
// }
