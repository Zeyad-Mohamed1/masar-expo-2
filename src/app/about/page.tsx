import { Metadata } from "next";
import AboutPage from "./components/AboutPage";

export const metadata: Metadata = {
    title: "About Us - Masar Expo",
    description: "Learn more about Masar Expo, the first online real estate exhibition in Egypt dedicated to Gulf clients.",
};

export default function Page() {
    return <AboutPage />;
} 