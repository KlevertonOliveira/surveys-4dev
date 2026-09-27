import { Calendar, Footer, Header } from "@/presentation/components";
import { SurveyResultItem } from "./components";
import FlipMove from "react-flip-move";

export default function SurveyResultPage() {
  return (
    <div className="flex flex-col min-h-screen h-full justify-between bg-background">
      <Header />

      <div className="flex flex-col self-center max-w-200 grow w-full px-5 py-10">

        <hgroup className="flex items-center mb-4 gap-4">
          <Calendar date={new Date()} className="w-20" />

          <h2 className="text-primaryDark text-2xl font-bold uppercase mb-6">
            What&apos;s your favorite web framework?
          </h2>
        </hgroup>

        <FlipMove className="flex flex-col gap-4">
          <SurveyResultItem />
        </FlipMove>

        <button className="mt-6">
          Back
        </button>
      </div>

      <Footer />
    </div>
  );
}