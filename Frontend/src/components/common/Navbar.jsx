import React from 'react';
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath} from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import {useSelector} from 'react-redux';
import { CiShoppingCart } from "react-icons/ci";
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { useState } from 'react';
import { useEffect } from 'react';
import { IoArrowDownCircle } from "react-icons/io5";
//import StudySyncLogo from "../../assets/Logo/StudySync-Logo.png";



const Navbar = () => {
    const {token}  = useSelector((state)=>state.auth);
    const {user} = useSelector((state)=>state.profile);
    const {totalItems} = useSelector((state)=>state.cart);

    const location = useLocation();
    const [subLinks, setSubLinks] = useState([]);

const fetchSubLinks = async()=>{
            try{
                const result = await apiConnector("GET",categories.CATEGORIES_API);
                console.log("printing sublinks results",result);
                setSubLinks(result?.data?.allCategories || []);
            }
            catch(error){
                console.log("Error in fetching categories",error);
            }
        }

    useEffect(()=>{
        fetchSubLinks();
    },[])

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    return (
        <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                <Link to="/">
                    <img src={Logo} width={160} height={42} loading="lazy" alt="StudyNotion Logo" />
                </Link>

                <nav>
                    <ul className="flex gap-x-6 text-richblack-25">
                        {NavbarLinks.map((link, index) => {
                            return (
                                <li key={index}>
                                    {link.title === "Catalog" ? (
                                        <div className='relative flex items-center gap-2 group'>
                                            <p>{link.title}</p>
                                            <IoArrowDownCircle />
                                        <div className='invisible absolute left-[50%] top-[50%] z-[1000] mt-4 flex w-[300px] translate-x-[-50%] flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100'>
                                            <div className='absolute left-[50%] top-0 translate-x-[80%] translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>

                                            </div>
                                            {
                                                subLinks.length > 0 ? (
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
                                                )
                                            }

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

                {/*login ans signup buttons*/}
                <div className = 'flex gap-x-4 items-center'>
                    {
                        user?.accountType === "Student" && (
                            <Link
                                to="/dashboard/cart"
                                className="relative text-richblack-25 transition-colors hover:text-yellow-25"
                                aria-label="Open cart"
                            >
                                <CiShoppingCart className="h-7 w-7" aria-hidden="true" />
                                {
                                    totalItems > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        !token && (
                            <Link to = "/login">
                                <button className = 'border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Login
                                </button>
                            </Link>
                        )
                    }
                    {
                        !token && (
                            <Link to = "/signup">
                                <button className = 'border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                                    Sign Up
                                </button>
                            </Link>
                        )
                    }
                    {
                        !!token && <ProfileDropDown/>
                    }

                </div>
            </div>
        </div>
    );
};

export default Navbar;
