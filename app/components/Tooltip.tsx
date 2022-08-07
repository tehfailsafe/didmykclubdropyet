import React from "react";

interface Props {
    children: React.ReactNode;
    message: string;
}

export const Tooltip: React.FC<Props> = ({ children, message }) => {
    return (
        <div className="relative flex flex-col items-center group">
            {children}
            <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                <span className="relative z-10 p-2 text-sm leading-none text-white whitespace-nowrap bg-gray-800 shadow-lg rounded-md">
                    {message}
                </span>
                <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-600"></div>
            </div>
        </div>
    );
};
