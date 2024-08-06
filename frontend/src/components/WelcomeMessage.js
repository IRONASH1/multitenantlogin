import React from 'react';

const WelcomeMessage = () => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    const welcomeMessage = subdomain === 'localhost' ? 'Welcome to my world' : `Welcome ${subdomain}`;

    return (
        <h1>{welcomeMessage}</h1>
    );
};

export default WelcomeMessage;
