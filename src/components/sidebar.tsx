import { Link, NavLink } from "react-router-dom"
import LogoW from "../assets/images/impossible_3d-logo-w-color.png"
import LogoSubtitle from "../assets/images/sublogo.png"

const Sidebar = () => {
    return (
        <div className="top-0 sm:h-screen sm:w-16 bg-zinc-900 text-[#4d4d4e] h-16 w-screen">
            <ul className="sm:sidebar-col sidebar-col-mobile sm:h-16">

                <Link className="sm:w-14 w-12" to="/">
                    <img className="" src={LogoW} />
                    <img className="" src={LogoSubtitle} />
                </Link>

                <NavLink to="/" className="fa-solid fa-home p-4 text-2xl" />
                <NavLink to="/about" className="fa-solid fa-user p-4 text-2xl" />
                <NavLink to="/contact" className="fa-solid fa-envelope p-4 text-2xl" />


                <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/will-huang2/" className="fa-brands fa-linkedin p-1 text-sm" />
                <a target="_blank" rel="noreferrer" href="https://github.com/Wayleem/" className="fa-brands fa-github p-1 text-sm" />
                <a target="_blank" rel="noreferrer" href="https://discordapp.com/users/203924694192226305/" className="fa-brands fa-discord p-1 text-sm" />

            </ul>
        </div >
    )
}

export default Sidebar