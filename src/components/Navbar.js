import React from 'react'
import './navbar.css';
export default function Navbar({children}) {
    return (
        <ul>
            {children}
        </ul>
    )
}

export function Link({link, children}){
    return (
        <li>
            <a onClick={link}>{children}</a>
        </li>
    )
}
