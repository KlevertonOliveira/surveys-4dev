import { render, screen } from "@testing-library/react";
import Calendar from "./calendar";

const makeSut = (date: Date): void => {
  render(<Calendar date={date} />);
};

describe("Calendar Component", () => {
  test("Should render with correct values (survey not answered)", () => {
    makeSut(new Date("2026-01-27T11:12:19.939Z"));

    expect(screen.getByTestId("day")).toHaveTextContent("27");
    expect(screen.getByTestId("month")).toHaveTextContent("Jan");
    expect(screen.getByTestId("year")).toHaveTextContent("2026");
  });

  test("Should render with correct values (survey answered)", () => {
    makeSut(new Date("2025-03-04T11:12:19.939Z"));

    expect(screen.getByTestId("day")).toHaveTextContent("04");
    expect(screen.getByTestId("month")).toHaveTextContent("Mar");
    expect(screen.getByTestId("year")).toHaveTextContent("2025");
  });
});