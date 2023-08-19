import React from "react";
import './Header.css';
import { Person, Forum } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const Header = () => {
    const { user } = useAuthContext();
    return (
        <div className="header">
            <Link to="/">
                <img className="header__logo" src="tinder.png" alt="header" />
            </Link>
            {user && (
                <>
                    <Link to="/profile">
                        <IconButton>
                            <Person fontSize="large" className="header__icon" />
                        </IconButton>
                    </Link>
                    <Link to="/messages">
                        <IconButton>
                            <Forum fontSize="large" className="header__icon" />
                        </IconButton>
                    </Link>
                </>
            )
            }


        </div>
    )
}

export default Header;