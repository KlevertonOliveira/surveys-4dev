/* eslint-disable no-constant-condition */
import type { JSX } from "react/jsx-runtime";

export default function SurveyResultItem(): JSX.Element {
  return (
    <li
      className={`flex justify-between bg-white items-center p-4 rounded-lg text-primaryDark 
      ${true ? "border-2 border-primaryLight" : ""}`}
    >
      <img
        src="https://media.istockphoto.com/id/1166522199/pt/foto/react-programming-web-app-paper-speech-bubble-and-mobile-display-concept-on-blue-background.jpg?s=1024x1024&w=is&k=20&c=ztDuELERlHreYt_f6C-vP0KtNCOfCWdmb1yYtAVn80c="
        alt="React"
        className="w-12 h-12 mr-4"
      />
      <span className="grow my-0 mr-4 text-xl">ReactJS</span>
      <span className="text-3xl">50%</span>
    </li>
  );
}