import React, { useState, useEffect } from 'react';
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { CiShoppingCart } from "react-icons/ci";
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { IoArrowDownCircle } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);

    const location = useLocation();
    const [subLinks, setSubLinks] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const fetchSubLinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("printing sublinks results", result);
            setSubLinks(result?.data?.allCategories || []);
        } catch (error) {
            console.log("Error in fetching categories", error);
        }
    };

    useEffect(() => {
        fetchSubLinks();
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    return (
        <div className="relative flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <img src={Logo} width={160} height={42} loading="lazy" alt="StudyNotion Logo" />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:block">
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => {
                            return (
                                <li key={index}>
                                    {link.title === "Catalog" ? (
                                        <div className='relative flex items-center gap-2 group'>
                                            <p>{link.title}</p>
                                            <IoArrowDownCircle />
                                            <div className='invisible absolute left-[50%] top-[50%] z-[1000] mt-4 flex w-[300px] translate-x-[-50%] flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100'>
                                                <div className='absolute left-[50%] top-0 translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'></div>
                                                {subLinks.length > 0 ? (
                                                    subLinks.map((subLink) => (
                                                        <Link
                                                            to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                            key={subLink._id}
                                                            className='rounded-lg bg-transparent py-2 pl-4 hover:bg-richblack-50'
                                                        >
                                                            <p>{subLink.name}</p>
                                                        </Link>
                                                    ))
                                                ) : (
                                                    <p className='py-2 pl-4'>No categories found</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                {link.title}
                                            </p>
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Desktop auth buttons */}
                <div className='hidden md:flex gap-x-4 items-center'>
                    {user?.accountType === "Student" && (
                        <Link
                            to="/dashboard/cart"
                            className="relative text-richblack-25 transition-colors hover:text-yellow-25"
                            aria-label="Open cart"
                        >
                            <CiShoppingCart className="h-7 w-7" aria-hidden="true" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    {!token && (
                        <Link to="/login">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                Login
                            </button>
                        </Link>
                    )}
                    {!token && (
                        <Link to="/signup">
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                Sign Up
                            </button>
                        </Link>
                    )}
                    {!!token && <ProfileDropDown />}
                </div>

                {/* Mobile hamburger button */}
                <button
                    className="md:hidden text-richblack-25 p-1"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {mobileMenuOpen && (
                <div className="absolute top-14 left-0 right-0 z-[999] bg-richblack-900 border-b border-richblack-700 shadow-lg md:hidden">
                    <div className="flex flex-col px-6 py-4 gap-4 text-richblack-25">
                        {/* Nav links */}
                        {NavbarLinks.map((link, index) => (
                            <div key={index}>
                                {link.title === "Catalog" ? (
                                    <div className="flex flex-col gap-2">
                                        <p className="font-medium text-richblack-25">{link.title}</p>
                                        <div className="flex flex-col gap-1 pl-3 border-l border-richblack-700">
                                            {subLinks.length > 0 ? (
                                                subLinks.map((subLink) => (
                                                    <Link
                                                        to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                                        key={subLink._id}
                                                        className="py-1 text-sm text-richblack-100 hover:text-yellow-25"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {subLink.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <p className="text-sm text-richblack-400">No categories found</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={link?.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"} font-medium`}
                                    >
                                        {link.title}
                                    </Link>
                                )}
                            </div>
                        ))}

                        {/* Divider */}
                        <div className="border-t border-richblack-700 pt-3 flex flex-col gap-3">
                            {/* Cart */}
                            {user?.accountType === "Student" && (
                                <Link
                                    to="/dashboard/cart"
                                    className="relative flex items-center gap-2 text-richblack-25"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <CiShoppingCart className="h-6 w-6" />
                                    <span>Cart</span>
                                    {totalItems > 0 && (
                                        <span className="ml-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                            )}
                            {/* Auth buttons */}
                            {!token && (
                                <div className="flex gap-3">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                                        <button className='w-full border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md text-sm'>
                                            Login
                                        </button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                                        <button className='w-full border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-100 rounded-md text-sm'>
                                            Sign Up
                                        </button>
                                    </Link>
                                </div>
                            )}
                            {!!token && <ProfileDropDown />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
