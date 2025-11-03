import React from "react"
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation"

export function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(60, 20, 90)"
      gradientBackgroundEnd="rgb(90, 30, 120)"
      firstColor="232, 121, 249"
      secondColor="160, 100, 255"
      thirdColor="80, 47, 122"
      fourthColor="232, 121, 249"
      fifthColor="160, 100, 255"
      pointerColor="232, 121, 249"
      size="80%"
      blendingValue="hard-light"
      containerClassName="fixed inset-0"
      interactive={true}
    >
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Welcome to Nomadiqe
        </p>
      </div>
    </BackgroundGradientAnimation>
  )
}

