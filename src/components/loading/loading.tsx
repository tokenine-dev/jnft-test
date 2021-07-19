import React from 'react'

export interface Props {
    children?: any
    text?: number,
    status?: boolean,
    padding?: boolean
}

export default function Loading(props: any) {
    const { children, text, status, padding } = props
    return (
        status ?
            <div className={`loading-container ${padding && '__padding'}`} >
                <div className="-wrapper-blur">
                    {children}
                </div>
                <div className="ring">
                    {text}
                    <span className="loading-span"></span>
                </div>
            </div> : children
    )

}
