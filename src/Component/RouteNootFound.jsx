
import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
                <p className="mt-4 text-xl">Sorry, the page you are looking for doesn't exist.</p>
            </div>
        </div>
    );
};

export default NotFound;
