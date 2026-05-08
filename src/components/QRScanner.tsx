"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function QRScanner() {
    const startedRef = useRef(false);
    const router = useRouter();

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const scanner = new Html5Qrcode("reader");

        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                debugger;
                console.log("Scanned:", decodedText);
                window.location.href = decodedText
            },
            (error) => {

                console.log(error);
            }
        );

        return () => {
            //scanner.stop().catch(() => {});
        };
    }, []);

    return <div id="reader" />;
}