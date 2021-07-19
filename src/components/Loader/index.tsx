import Loader from "react-loader-spinner"

export const LoadingScreen = ({ isLoading = false, size = 200, zIndex = 100000 }) => {
    return (
        <div className={`page-fullcover ${isLoading && '_loading'}` } style={{ zIndex: zIndex + 10 }}>
            <Loader type="TailSpin" color="#bb366a" height={size} width={size} />
            <div className="fixed top-0 left-0 bottom-0 right-0 bg-black w-screen h-screen" style={{ opacity: 0.1, zIndex }} /> 
        </div>
    )
}
