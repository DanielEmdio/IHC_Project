import React, { useState } from 'react';

function DropDown() {
    const [selectedItem, setSelectedItem] = useState('Payment Method');

    const handleSelect = (e) => {
        setSelectedItem(e.target.textContent);
    };

    const toggleStyles = {
        backgroundColor: '#10b981',
        color: 'white',
        borderColor: '#10b981',
        fontWeight: 'bold'
    };

    const toggleStyles2 = {
        backgroundColor: 'white',
        color: '#10b981',
        borderColor: '#10b981',
        fontWeight: 'bold'
    };

    return (
        <details className="dropdown">
            <summary className="m-1 btn" style={toggleStyles}>{selectedItem}</summary>
            <ul onClick={handleSelect} className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52" style={toggleStyles2}>
                <li><a>MbWay</a></li>
            </ul>
        </details>
    );
}

export default DropDown;
