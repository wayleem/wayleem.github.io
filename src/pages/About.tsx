import { motion } from 'framer-motion'
import { useState } from 'react'
import sbuBanner from '../assets/icons/sbu.png'
import cityBanner from '../assets/icons/city.png'
import guitarBanner from '../assets/icons/guitar.png'
import popMP3 from '../assets/audio/pop.mp3'

function About() {
  const [greetingIndex, setGreetingIndex] = useState(0)
  const [nameIndex, setNameIndex] = useState(0)

  const greetings = ['Hello,', 'Wassup,', 'Hey!', 'Hi,']
  const names = ["I'm William.", "It's William!", 'William here.']

  const poof = new Audio(popMP3)

  const toggleGreeting = () => {
    poof.play()
    setGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length)
  }

  const toggleName = () => {
    poof.play()
    setNameIndex((prevIndex) => (prevIndex + 1) % names.length)
  }
  // easter eggs ^
  //-------------------------------------------------------------------------
  return (
    <div>
      {/* greeting card */}
      <div className="flex flex-col text-center">
        <motion.div
          className="mt-16 w-fit self-center pointer-events-auto"
          initial={{ translateY: -200 }}
          animate={{
            translateY: [-200, 20, 0],
            transition: {
              duration: 0.5,
              times: [0, 0.8, 1],
              ease: 'easeInOut',
            },
          }}
          exit={{ translateY: -200, transition: { duration: 0.2 } }}
        >
          <span className="h1 w-fit space-y-4 self-center">
            <h1
              className="transform transition-all hover:text-base-100 hover:scale-105 active:animate-pop-in-out"
              onClick={toggleGreeting}
            >
              {greetings[greetingIndex]}
            </h1>
            <h1
              className="transform transition-all hover:text-base-100 hover:scale-105 active:animate-pop-in-out"
              onClick={toggleName}
            >
              {names[nameIndex]}
            </h1>
          </span>
        </motion.div>

        <motion.p
          className="body mt-6 w-[30%] self-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, delay: 0.4 } }}
          exit={{ opacity: 0 }}
        >
          Welcome to my portfolio. I am a student developer pursuing a career in
          software engineering.
        </motion.p>
      </div>

      {/* about me content */}
      <motion.div
        className="absolute inset-0 w-screen h-screen"
        initial={{ translateX: -2000 }}
        animate={{
          translateX: [-2000, 20, 0],
          transition: {
            duration: 0.5,
            times: [0, 0.8, 1],
            ease: 'easeInOut',
          },
        }}
        exit={{ translateY: -1200, transition: { duration: 0.2 } }}
      >
        <div className="absolute w-full h-full">
          {/* life body */}
          <div className="absolute left-[10%] top-[20%]">
            <img src={cityBanner} className="-z-10 w-[550px] opacity-50" />
            <h1 className="float-text-sm -mt-16">Life</h1>
            <motion.p
              className="body mt-2 w-[45%]"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.2, delay: 0.4 },
              }}
              exit={{ opacity: 0 }}
            >
              I grew up in NYC from a chinese household. I've always loved
              making and building things, which made sense of why I pursued a
              career in SWE.
            </motion.p>
          </div>

          {/* education body */}
          <div className="absolute right-[10%] top-[40%] w-[26%]">
            <img src={sbuBanner} className="-ml-16 w-[450px]" />
            <h1 className="font-subtitle text-4xl text-base-content -mt-2 ml-8">
              Education
            </h1>
            <motion.p
              className="body mt-2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.2, delay: 0.4 },
              }}
              exit={{ opacity: 0 }}
            >
              I am a student at Stony Brook University. I am pursuing a B.S. in
              Technical Systems Management with a discipline in Computer
              Science.
            </motion.p>
          </div>

          {/* hobbies body */}
          <div className="absolute left-[20%] top-[55%] w-[25%]">
            <img src={guitarBanner} className="-ml-28 w-[800px]" />
            <h1 className="font-subtitle text-4xl text-base-content -mt-32 ml-48">
              Hobbies
            </h1>
            <motion.p
              className="body mt-4"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.2, delay: 0.4 },
              }}
              exit={{ opacity: 0 }}
            >
              In my free time, I work on my side projects, learning and hopping
              on the latest framework trends. Outside of programming, I enjoy
              playing the guitar.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default About
