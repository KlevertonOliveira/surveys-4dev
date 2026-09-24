/* eslint-disable no-constant-condition */
import { Footer, Header } from "@/presentation/components";
import FlipMove from "react-flip-move";

export default function SurveyResultPage() {
  return (
    <div className="flex flex-col min-h-screen h-full justify-between bg-disabled-background">
      <Header />

      <div className="flex flex-col self-center max-w-200 grow w-full px-5 py-10">
        <h2 className="text-primaryDark text-xl font-bold uppercase mb-6">
          What`&apos;`s your favorite web framework?
        </h2>

        <FlipMove className="flex flex-col gap-4">
          <li
            className={`flex justify-between bg-white items-center p-4 rounded-lg text-primaryDark 
              ${true ? "border-2 border-primaryLight" : ""}`}
          >
            <img
              src="https://media.istockphoto.com/id/1166522199/pt/foto/react-programming-web-app-paper-speech-bubble-and-mobile-display-concept-on-blue-background.jpg?s=1024x1024&w=is&k=20&c=ztDuELERlHreYt_f6C-vP0KtNCOfCWdmb1yYtAVn80c="
              alt="React"
              className="w-12 h-12"
            />
            <span className="grow my-0 mx-4 text-xl">ReactJS</span>
            <span className="text-3xl">50%</span>
          </li>
        </FlipMove>

        <button
          className="mt-6"
        >
          Back
        </button>
      </div>

      <Footer />
    </div>
  );
}