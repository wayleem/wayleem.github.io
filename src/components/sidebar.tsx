import { Link, NavLink } from "react-router-dom"
import LogoW from "../assets/images/impossible_3d-logo-w-color.png"
import LogoSubtitle from "../assets/images/sublogo.png"

const Sidebar = () => {
    return (
        <div className="top-0 h-screen w-16 bg-zinc-900 text-[#4d4d4e]">

            <li className="flex flex-col items-center text-2xl">
                <Link className="mt-4 w-12" to="/">
                    <img className="" src={LogoW} />
                    <img className="" src={LogoSubtitle} />
                </Link>

                <NavLink to="/" className="fa-solid fa-home p-4" />
                <NavLink to="/about" className="fa-solid fa-user p-4" />
                <NavLink to="/contact" className="fa-solid fa-envelope p-4" />

                <li className="flex flex-col items-center text-sm">
                    <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/will-huang2/" className="fa-brands fa-linkedin p-1" />
                    <a target="_blank" rel="noreferrer" href="https://github.com/Wayleem/" className="fa-brands fa-github p-1" />
                    <a target="_blank" rel="noreferrer" href="https://discordapp.com/users/203924694192226305/" className="fa-brands fa-discord p-1" />
                </li>
            </li>
        </div >
    )
}

export default Sidebar