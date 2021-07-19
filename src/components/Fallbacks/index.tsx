export const FallbackLoading = () => {

    return (
        <div className="flex flex-col items-center p-10 pt-4 justify-center text-1xl" style={{ minHeight: "80vh" }} >
            <div className="label border-opacity-20">
                <h2 className="title">Loading</h2>
            </div>

            <div className="lg:w-32 mx-auto">
            </div>
        </div>
    )
}

export const FallbackWorkIsNotApproved = () => {
    const onClick = () => {}

    return (
        <div className="flex flex-col items-center p-10 pt-4 justify-center text-1xl">
            <div className="label border-opacity-20">
                <h2 className="title">Work approval pending</h2>
            </div>

            <div className="lg:w-32 mx-auto">
                <button
                    onClick={onClick}
                    className="w-full sm:w-auto inline-flex bg-gray-900 hover:bg-gray-700 text-white textLg leading-6 font-semibold py-3 pr-6 pl-3 border border-transparent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200 mx-auto"
                >
                    Send Request Again
                </button> 
            </div>
        </div>
    )
}

export const FallbackWorkIsNotAvailable = () => {

  return (
      <div className="flex flex-col items-center p-10 pt-4 justify-center text-1xl w-screen" style={{ height: '60vh' }}>
          <div className="label border-opacity-20">
              <h2 className="title">Work is not available</h2>
          </div>

          <div className="lg:w-32 mx-auto">
              {/* <button
                  onClick={onClick}
                  className="w-full sm:w-auto inline-flex bg-gray-900 hover:bg-gray-700 text-white textLg leading-6 font-semibold py-3 pr-6 pl-3 border border-transparent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200 mx-auto"
              >
                  Send Request Again
              </button>  */}
              View other works
          </div>
      </div>
  )
}
