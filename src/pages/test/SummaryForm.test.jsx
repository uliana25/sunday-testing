import { render, screen, fireEvent } from "@testing-library/react";
import { SummaryForm } from "../summary/SummaryForm";
test("check initial conditions", () => {
  render(<SummaryForm />);
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  expect(checkboxElement).not.toBeChecked();

  expect(checkboxElement).toBeInTheDocument();
});

test("First click makes button active and second inactive", () => {
  render(<SummaryForm />);
  const checkboxElement = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const buttonElement = screen.getByRole("button", { name: /confirm order/i });

  fireEvent.click(checkboxElement);
  expect(buttonElement).toBeEnabled();

  fireEvent.click(checkboxElement);
  expect(buttonElement).toBeDisabled();
});
