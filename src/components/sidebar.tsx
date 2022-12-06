import { Link, NavLink } from "react-router-dom"
import LogoW from "../assets/images/impossible_3d-logo-w-color.png"
import LogoSubtitle from "../assets/images/sublogo.png"

const Sidebar = () => {
    return (
        <div className="bg-zinc-900 text-[#4d4d4e] top-0 left-0 h-16 w-screen sidebar-col-mobile sm:h-screen sm:w-16 sm:sidebar-col fixed">

            <Link className="w-12 mx-2 sm:m-4" to="/">
                <img src={LogoW} />
                <img className="sm:flex hidden" src={LogoSubtitle} />
            </Link>

            <nav className="text-2xl my-1 sm:sidebar-col sm:relative sm:mt-auto">
                <NavLink to="/" className="fa-solid fa-home p-4" />
                <NavLink to="/about" className="fa-solid fa-user p-4" />
                <NavLink to="/contact" className="fa-solid fa-envelope p-4" />
            </nav>

            <div className="hidden sm:sidebar-col sm:relative sm:mt-auto">
                <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/will-huang2/" className="fa-brands fa-linkedin sidebar-external-link" />
                <a target="_blank" rel="noreferrer" href="https://github.com/Wayleem/" className="fa-brands fa-github sidebar-external-link" />
                <a target="_blank" rel="noreferrer" href="https://discordapp.com/users/203924694192226305/" className="fa-brands fa-discord sidebar-external-link" />
            </div>

        </div>
    )
}

export default Sidebar