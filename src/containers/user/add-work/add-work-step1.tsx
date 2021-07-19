import React from 'react'
import ART from 'assets/img/art.jpeg'

export default function AddWorkStep1() {
    return (
        <div className="max-w-screen-xl w-full mx-auto hero-body flex items-center mt-0 md:my-8">
            <div className="max-w-screen-xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2">
                <div className="md:flex md:flex-row">
                    <div className="lg:w-1/2 mb-6 rounded-lg">
                        <div className="custom:preview-photo">
                            <img className="ml-auto" src={ART} alt="" />
                        </div>
                    </div>
                    <div className="lg:w-1/2 md:px-10">
                        <div className="custom:input-feild">
                            <h2 className="text-4xl font-semibold pb-4">Dream Dancer 1.0</h2>
                            <p className="text-gray-600 my-8 max-w-sm">
                                🍃 Let life motivates you
                                    <br></br>
                                    Dream dancer represents a dancer in the sky, a surreal environment with him around flowers and vegetation.
                                    <br></br>
                                    From a collection of 2 Soothing visual
                                    <br></br>
                                    3240x4050 px 1/1 Exclusively on Foundation
                            </p>
                            <div className="mt-6">
                                <span className="block">Connected to</span>
                                <div className="inline-block items-center shadow-md hover:shadow-lg justify-center px-3 py-3 border border-transparent text-base font-medium rounded-xl bg-white hover:bg-indigo-50">
                                    <span className="flex items-center justify-center">
                                        <span className="custom:dot-connected">•</span>
                                        <span className="text-base text-gray-500">
                                            0x0A6F...4090
                                    </span>
                                    </span>
                                </div>
                            </div>
                            <div className="md:flex items-center custom-ui mt-8">
                                <div className="rounded-md">
                                    <a className="w-full sm:w-auto inline-flex justify-center bg-gray-900 hover:bg-gray-700 text-white text-lg leading-6 font-semibold py-3 px-6 border border-transparent rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200" href="#">
                                        <span className="flex items-center ml-2 mr-2">
                                            <span className="custom:spinners">
                                                <span className="double-bounce1"></span>
                                                <span className="double-bounce2"></span>
                                            </span>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
