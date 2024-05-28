import { IoChatbubble } from "react-icons/io5";
import DropDown from "../../Components/Settings/DropDown";
import MaterialDesignSwitch from "../../Components/Settings/MaterialDesignSwitch";
import PopupComponent from "../../Components/Settings/PopupComponent";
import * as utils from "../../Utils/utils";
import React, { useState } from 'react';

function Settings() {
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = async (anchor) => {
        // prevent anchor page reload
        anchor.preventDefault();

        // redirect the user to the login page
        utils.goToHome();
    };

    return (
        <div className=" w-11/12 mx-auto">
            <h1 className='my-3 text-2xl font-bold'>Notifications</h1>
            <MaterialDesignSwitch color="#10b981" />
            <div className="divider"></div>
            <h1 className='my-3 text-2xl font-bold'>Payment Method</h1>
            <DropDown />
            <div className="divider"></div>
            <a onClick={handleSubmit} style={{ fontWeight: 'bold', backgroundColor: '#10b981', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', textDecoration: 'none' }}>About Us</a>
            <div className="divider"></div>
            <button
                style={{ fontWeight: 'bold', backgroundColor: '#10b981', color: 'white', padding: '10px', cursor: 'pointer', borderRadius: '5px' }}
                onClick={() => setShowPopup(true)}>
                Delete Account
            </button>
            {showPopup && <PopupComponent onClose={() => setShowPopup(false)} />}
            <div className="divider"></div>
        </div>
    )
}

export default Settings;
