import MeetingPage from "./MeetingPage";
import GuestVerification from "./components/GuestVerification";
import GuestChecker from "./components/GuestChecker";
import { Metadata } from "next";

interface PageProps {
  params: { id: string };
  searchParams: { guest: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Meeting ${id}`,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { guest } = await searchParams;

  const guestMode = guest === "true";

  // If not in guest mode, check localStorage (client-side) and show form
  if (!guestMode) {
    return (
      <>
        <GuestChecker meetingId={id} />
        <GuestVerification meetingId={id} />
      </>
    );
  }

  // In guest mode, show meeting page
  return <MeetingPage id={id} />;
}
