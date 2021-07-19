import React from 'react'

/* --- Image Import --- */
import JNFT from '../../assets/img/JNFT.logo.svg'

export default function Footer() {
    return (
        <footer id="footer">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-8">
                <div className="md:flex justify-between items-center text-gray-900">
                    <div>
                        <ul className="md:inline-flex items-center">
                            <li className="mr-4 py-2 md:py-0">
                                <a href="" className="hoverblock transform transition-colors duration-200 py-2 hover:text-gray-900">
                                    <img className="block h-4 w-auto" src={JNFT} alt="Workflow" />
                                </a>
                            </li>
                            {/* <li className="mr-4 py-2 md:py-0"> <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900"> Instagram</a></li>
                            <li className="mr-4 py-2 md:py-0"> <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900"> Twitter </a></li>
                            <li className="mr-4 py-2 md:py-0"> <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900"> Discord </a></li>
                            <li> <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900"> Blog </a></li> */}
                        </ul>
                    </div>
                    <div>
                        <ul className="md:inline-flex py-8">
                            <li className="mr-4 py-2 md:py-0">
                                <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900"> About </a>
                            </li>
                            <li className="mr-4 py-2 md:py-0">
                                <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900"> Community Guidelines </a>
                            </li>
                            <li className="mr-4 py-2 md:py-0">
                                <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900"> Terms of Service </a>
                            </li>
                            <li className="mr-4 py-2 md:py-0">
                                <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900"> Privacy </a>
                            </li>
                            {/* <li className="mr-4 py-2 md:py-0">
                                <a href="" className="hoverblock transform transition-colors duration-200 py-2 text-gray-500 hover:text-gray-900">Careers</a>
                            </li> */}
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
        /* --- End Footer --- */
    )
}
