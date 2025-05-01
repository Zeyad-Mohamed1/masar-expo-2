import useStreamCall from "@/hooks/useStreamCall";
import {
  CallControls,
  PaginatedGridLayout,
  ParticipantView,
  SpeakerLayout,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import {
  BetweenHorizonalEnd,
  BetweenVerticalEnd,
  LayoutGrid,
  X,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import EndCallButton from "./EndCallButton";

// type CallLayout = "speaker-vert" | "speaker-horiz" | "grid";

export default function FlexibleCallLayout() {
  const { id } = useParams();
  const { useParticipantCount } = useCallStateHooks();

  const participantCount = useParticipantCount();

  useEffect(() => {
    // Update developer count when participantCount changes
    const updateDeveloperCount = async () => {
      try {
        if (!id) return;

        const response = await fetch("/api/update-developer-count", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            zoomId: id,
            count: participantCount,
          }),
        });

        if (!response.ok) {
          console.error("Failed to update developer count");
        }
      } catch (error) {
        console.error("Error updating developer count:", error);
      }
    };

    updateDeveloperCount();
  }, [participantCount, id]);

  // const [layout, setLayout] = useState<CallLayout>("speaker-vert");

  const call = useStreamCall();

  const router = useRouter();

  return (
    <div dir="ltr" className="my-5 space-y-3">
      {/* <CallLayoutButtons layout={"grid"} setLayout={() => {}} /> */}
      <CallLayoutView layout={"grid"} />
      <div className="flex items-center justify-center gap-x-2">
        <Link
          href={`/`}
          className="flex size-10 items-center justify-center rounded-full bg-red-600"
        >
          <Phone className="size-5 text-white" />
        </Link>
        <ToggleAudioPublishingButton />
        <ToggleVideoPublishingButton />
      </div>
      {/* <EndCallButton /> */}
    </div>
  );
}

// interface CallLayoutButtonsProps {
//   layout: CallLayout;
//   setLayout: (layout: CallLayout) => void;
// }
interface CallLayoutButtonsProps {
  layout: string;
  setLayout: (layout: string) => void;
}

function CallLayoutButtons({ layout, setLayout }: CallLayoutButtonsProps) {
  return (
    <div className="mx-auto w-fit space-x-6">
      <button onClick={() => setLayout("speaker-vert")}>
        <BetweenVerticalEnd
          className={layout !== "speaker-vert" ? "text-gray-400" : ""}
        />
      </button>
      <button onClick={() => setLayout("speaker-horiz")}>
        <BetweenHorizonalEnd
          className={layout !== "speaker-horiz" ? "text-gray-400" : ""}
        />
      </button>
      <button onClick={() => setLayout("grid")}>
        <LayoutGrid className={layout !== "grid" ? "text-gray-400" : ""} />
      </button>
    </div>
  );
}

interface CallLayoutViewProps {
  layout: string;
}

function CallLayoutView({ layout }: CallLayoutViewProps) {
  if (layout === "speaker-vert") {
    return <SpeakerLayout />;
  }

  if (layout === "speaker-horiz") {
    return <SpeakerLayout participantsBarPosition="right" />;
  }

  if (layout === "grid") {
    return <PaginatedGridLayout />;
  }

  return null;
}
