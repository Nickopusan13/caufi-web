"use client";

import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Reorder, motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { LuImagePlus } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import ToasterProvider from "@/components/ToasterProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaQuestionCircle } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { useEffect, memo } from "react";
import { useDeleteProductImage } from "@/hooks/useProduct";
import type { ProductImage } from "@/api/product";

const MotionImage = motion(Image);

type DisplayImagesProps = {
  images: ProductImage[];
  setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
  maxImages?: number;
  productId?: number | null; // Optional: needed if deleting requires product context
};

export default memo(function DisplayImages({
  images,
  setImages,
  maxImages = 5,
}: DisplayImagesProps) {
  const { mutate: deleteImage, isPending: isDeleting } =
    useDeleteProductImage();

  const handleDelete = async (image: ProductImage) => {
    // Case 1: Local file (newly uploaded, not yet saved to server)
    if (image.file) {
      URL.revokeObjectURL(image.imageUrl);
      setImages((prev) =>
        prev.filter((img) => img.imageUrl !== image.imageUrl)
      );
      toast.success("Local image removed");
      return;
    }

    // Case 2: Existing server image (has id)
    if (image.id != null) {
      try {
        await deleteImage(image.id, {
          onSuccess: () => {
            setImages((prev) => prev.filter((img) => img.id !== image.id));
            toast.success("Image deleted successfully");
          },
          onError: (err) => {
            toast.error("Failed to delete image");
            console.error(err);
          },
        });
      } catch (err) {
        toast.error("Failed to delete image");
        console.error(err);
      }
      return;
    }

    // Fallback warning
    console.warn("Image has no id and is not local:", image);
    toast.error("Unable to delete this image");
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxImages} images allowed!`);
        return;
      }

      const filesToAdd = acceptedFiles.slice(0, remainingSlots);
      if (acceptedFiles.length > remainingSlots) {
        toast("Some images were not added (max limit reached)", {
          icon: <CiWarning className="text-yellow-400" />,
        });
      }

      const newImages: ProductImage[] = filesToAdd.map((file) => ({
        imageUrl: URL.createObjectURL(file),
        file, // Keep the File object for later upload
      }));

      setImages((prev) => [...prev, ...newImages]);
    },
  });

  // Cleanup object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.file) {
          URL.revokeObjectURL(img.imageUrl);
        }
      });
    };
  }, [images]);
  return (
    <Card className="w-full">
      <ToasterProvider />
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Product Images</CardTitle>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button">
              <FaQuestionCircle className="text-gray-500 hover:text-gray-700" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>The first image will be used as the thumbnail.</p>
            <p>Drag to reorder images.</p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>

      <CardContent>
        <Reorder.Group
          axis="x"
          values={images}
          onReorder={setImages}
          className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-thin"
        >
          {images.map((item, index) => (
            <Reorder.Item key={item.imageUrl || item.id} value={item}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative group w-28 h-28 rounded-lg overflow-hidden shadow-md cursor-grab shrink-0"
                  >
                    <MotionImage
                      src={item.imageUrl}
                      alt={item.imageUrl || "Product image"}
                      width={112}
                      height={112}
                      draggable={false}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                      {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isDeleting}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                    >
                      <IoMdClose size={16} />
                    </button>
                  </motion.div>
                </TooltipTrigger>
              </Tooltip>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {images.length < maxImages && (
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-400 p-10 text-center rounded-xl hover:border-blue-500 transition cursor-pointer bg-zinc-800/50 mt-6"
          >
            <input {...getInputProps()} />
            <LuImagePlus className="text-8xl text-blue-400 opacity-70 mx-auto mb-4" />
            <p className="text-white font-medium">
              Drag & drop images here or{" "}
              <span className="text-blue-400 underline">click to browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Max {maxImages} images • PNG/JPG only
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
