import React from "react";
import Banner from "../components/Dashboard/ViewStorage/Banner";
import Folders from "../components/Dashboard/ViewStorage/Folders";

export default function ViewStorage() {
    return (
        <div className="p-8 flex-1 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <header className="mb-8">
                <h1 className="text-4xl text-center font-bold text-gray-900">View Storage</h1>
            </header>

            <Banner />
            <Folders />
        </div>
    );
}
