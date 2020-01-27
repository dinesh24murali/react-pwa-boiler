import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

function App() {

    return <h1>Hello world</h1>
}

ReactDOM.render(<App />, document.getElementById('root'));

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        if (navigator.serviceWorker)
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
