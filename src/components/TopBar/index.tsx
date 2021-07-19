import { useState } from "react"
import { Navbar } from "components"
import { ProfileMini } from "components/profile/ProfileMini"

export const TopBar = () => {
    const [ isActiveExpandPanel, setActiveExpandPanel ] = useState(false)
    const [ expandPanelMode, setExpandPanelMode ] = useState('profile')

    function openExpandTopBar (mode: string, modifier: any = {}) {
        if (modifier?.close) { return setActiveExpandPanel(false) }
        // console.log("openExpandTopBar", mode)
        setActiveExpandPanel(true)
        setExpandPanelMode(mode)
    }


    return (
        <div id="topbar" className={`jimmyis-bg-gradient-living-vein jimmyis-boxfx-shadowlifter ${isActiveExpandPanel ? "_expand" : "_hide"}`}>
            <Navbar id="default" data={{ isActiveExpandPanel }} handlers={{ openExpandTopBar }} />
            {
                (<>
                    { expandPanelMode === "profile" && (<ProfileMini data={{ isActiveExpandPanel }} handlers={{ openExpandTopBar }} />)}
                </>)
            }
        </div>
    )
}

export default TopBar;
