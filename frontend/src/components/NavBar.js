import React from 'react';

function NavBar({account}) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <span className="navbar-brand">DVideo</span>
                <div className="w-100">
                    {
                        account ? <span className="float-end">{account}</span> : ""
                    }
                </div>
            </div>
        </nav>
    );
}

export default NavBar;