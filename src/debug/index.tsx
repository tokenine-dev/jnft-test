import { useState, useEffect } from 'react'
import { RTDB } from 'libs/firebase-sdk'

export const DebuggerRoot = (props: any) => {
    const appSettingsRef = RTDB.ref('app-settings')
    const [ appSettings, setAppSettings ] = useState<any>({})

    useEffect(() => {
        appSettingsRef.on('value', (snapshot) => {
            const data = snapshot.val()
            // console.log("RTDB", snapshot, data)
            setAppSettings(data)
        })
    }, [])
    
    return (<>
        <div>
            Debug Root

            {/* { JSON.stringify(appSettings) } */}
        </div>
    </>)
}

// export { DebuggerRoot }
