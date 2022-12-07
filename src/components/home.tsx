import { Link } from "react-router-dom"
import { useState } from "react"

const Home = () => {
    const [letterClass, setLetterClass] = useState("text-animate")
    const nameArray = ['W', 'i', 'l', 'l', 'i', 'a', 'm', ',']

    return (
        <div className="content-container w-screen h-full relative top-10 sm:top-60 sm:left-20">
            <h1 className="relative tracking-wide leading-snug m-4 text-4xl font-header sm:leading-normal sm:text-5xl">
                Hi,
                <br />
                I'm William,
            </h1>
            <h2 className="relative tracking-widest m-4 mt-6 text-xs font-normal font-body sm:font-light sm:text-2xl">
                Student / Game Dev; Design / Front-End Dev
            </h2>
        </div>
    )
}

export default Home