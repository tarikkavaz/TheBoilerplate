"use client";

import { ContentImage } from "@/utils/types";
import Image from "next/image";
// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css/bundle";
// import Swiper required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";

export default function App({ homepage }: any) {
  return (
    <Swiper
      loop={true}
      centeredSlides={true}
      autoplay={{
        delay: 5500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="h-[300px] md:h-[400px] lg:h-[550px] bg-slate-300"
      // onSwiper={(swiper) => console.log(swiper)}
      // onSlideChange={() => console.log("slide change")}
    >
      {homepage.images &&
        homepage.images.map((image: ContentImage) => (
          <SwiperSlide key={image.id}>
            <picture className="block relative w-full h-full">
              <Image
                fill
                src={image.image}
                priority={true}
                alt={image.alt_text}
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </SwiperSlide>
        ))}
    </Swiper>
  );
}
