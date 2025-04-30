import { Metadata } from "next";
import MeetingLoginPage from "./MeetingLoginPage";
import MeetingPage from "./MeetingPage";

interface PageProps {
  params: { id: string };
  searchParams: { guest: string };
}

export function generateMetadata({ params: { id } }: PageProps): Metadata {
  return {
    title: `Meeting ${id}`,
  };
}

export default async function Page({
  params: { id },
  searchParams: { guest },
}: PageProps) {
  const guestMode = guest === "true";

  if (!guestMode) {
    return <MeetingLoginPage />;
  }

  return <MeetingPage id={id} />;
}
