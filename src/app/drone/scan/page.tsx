"use client";

import QRScanner from "@/components/QRScanner";
import {useState} from "react";

export default function Home() {

    const [start, setStart] = useState(false);

    return (
        <div>
            {!start && (
                <button onClick={() => setStart(true)}>
                    Start scanning
                </button>
            )}

            {start && <QRScanner />}
        </div>
    );
}