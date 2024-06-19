import React from 'react';

export const SpinnerLoading: React.FC = () => (
    <div className="container m-5 d-flex justify-content-center" style={{ height: 50 }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);
