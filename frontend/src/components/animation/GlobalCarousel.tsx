"use client";

import { FC } from 'react';
import { ContentImage } from "@/utils/types";
import Image from "next/image";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import {GlobalCarouselProps} from "@/utils/types";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

export const GlobalCarousel: FC<GlobalCarouselProps> = ({
  images,
  autoplayDelay = 5500,
  loop = true,
  centeredSlides = true,
  paginationClickable = true,
  navigationEnabled = true,
  className = "h-[300px] md:h-[400px] lg:h-[550px] bg-[hsl(var(--background))]"
}) => {
  return (
    <Swiper
      loop={loop}
      centeredSlides={centeredSlides}
      autoplay={{
        delay: autoplayDelay,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: paginationClickable,
      }}
      navigation={navigationEnabled}
      modules={[Autoplay, Pagination, Navigation]}
      className={className}
    >
      {images &&
        images.map((image: ContentImage) => (
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
};
