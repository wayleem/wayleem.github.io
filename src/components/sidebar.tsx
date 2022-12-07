import { Link, NavLink } from "react-router-dom"
import LogoW from "../assets/images/impossible_3d-logo-w-color.png"
import LogoSubtitle from "../assets/images/sublogo.png"

const Sidebar = () => {
    return (
        <div className="bg-zinc-900 text-[#4d4d4e] h-12 w-screen sidebar-col-mobile relative sm:h-screen sm:w-16 sm:sidebar-col">

            <Link className="w-10 mx-2" to="/">
                <img className="mt-6" src={LogoW} />
                <img className="invisible sm:visible" src={LogoSubtitle} />
            </Link>

            <nav className="text-2xl my-1 sm:sidebar-col sm:relative sm:mt-auto">
                <NavLink to="/" className="fa-solid fa-home p-4 hover:text-[#ffd700]" />
                <NavLink to="/about" className="fa-solid fa-user p-4 hover:text-[#ffd700]" />
                <NavLink to="/contact" className="fa-solid fa-envelope p-4 hover:text-[#ffd700]" />
            </nav>

            <div className="invisible sm:visible sm:sidebar-col sm:relative sm:mt-auto">
                <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/will-huang2/" className="fa-brands fa-linkedin sidebar-external-link hover:text-[#ffd700]" />
                <a target="_blank" rel="noreferrer" href="https://github.com/Wayleem/" className="fa-brands fa-github sidebar-external-link hover:text-[#ffd700]" />
                <a target="_blank" rel="noreferrer" href="https://discordapp.com/users/203924694192226305/" className="fa-brands fa-discord sidebar-external-link hover:text-[#ffd700]" />
            </div>

        </div>
    )
}

export default Sidebar