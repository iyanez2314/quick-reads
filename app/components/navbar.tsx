import React from "react";
import { Book } from "./book";

export default function Navbar() {
  return (
    <div className="navbar bg-white">
      <div className="navbar-start">
        <div className="dropdown text-[#434343]">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-[#434343] rounded-box z-[1] mt-3 w-52 p-2 shadow text-white"
          >
            <li>
              <a>Pricing</a>
            </li>
            <li>
              <a>FAQ</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-end">
        <a className="btn btn-ghost text-xl text-[#434343]">Quick Reads</a>
      </div>
    </div>
  );
}
