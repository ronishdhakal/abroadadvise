"use client";
import dynamic from "next/dynamic";
import "jodit/build/jodit.min.css";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default JoditEditor;
