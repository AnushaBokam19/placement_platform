import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="mt-4">The page you requested could not be found.</p>
        <div className="mt-6">
          <Link to="/" className="btn btn-primary">Go home</Link>
        </div>
      </div>
    </div>
  );
}

