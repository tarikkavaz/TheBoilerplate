// frontend/src/components/DialogImage.tsx
"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { ContentImage } from "@/utils/types";

interface DialogImageProps {
  image: ContentImage;
}

export default function DialogImage({ image }: DialogImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <picture key={image.id}>
          <Image
            src={image.image}
            priority={true}
            width={500}
            height={300}
            alt={image.alt_text}
            className="bg-accent w-full h-auto cursor-pointer"
          />
        </picture>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] max-h-[90%]">
        <picture key={image.id}>
          <Image
            src={image.image}
            priority={true}
            width={500}
            height={300}
            alt={image.alt_text}
            className="bg-accent w-full h-auto"
          />
        </picture>
      </DialogContent>
    </Dialog>
  );
}