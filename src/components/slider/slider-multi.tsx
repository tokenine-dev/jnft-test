import React ,{useState,useEffect} from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export interface MultiSliderProps {
    children:any
}

export default function MultiSlider({children}:MultiSliderProps) {

    // ---
    const [currentIndex, setCurrentIndex] = useState(0)
    const [length, setLength] = useState(children.length)

    useEffect(() => {
        setLength(children.length)
    }, [children])
    // ---

    // ---
    const next = () => {
        if (currentIndex < (length - 1)) {
            setCurrentIndex(prevState => prevState + 1)
        }
    }
    

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevState => prevState - 1)
        }
    }

    
    const numPages = Math.ceil(children.length / 4)
    let btnDisabled = numPages === (numPages * currentIndex) 


// ---

    return (
        <aside> 
            <div className="carousel-container">
                <div className="carousel-wrapper">
                    <button className="left-arrow" onClick={prev}>
                        {/* &lt; */}
                        <ArrowBackIcon/>
                    </button>
                    <div className="carousel-content-wrapper">
                        <div className="carousel-content" style={{ transform: `translateX(-${currentIndex * 100}%)` }} >
                            {children}
                        </div>
                    </div>
                    <button disabled={btnDisabled} className="right-arrow" onClick={next}>
                        {/* &gt; */}
                        <ArrowForwardIcon/>
                    </button>
                </div>
            </div>
        </aside>
    )
}



