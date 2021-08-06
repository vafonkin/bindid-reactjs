import { render, screen } from "@testing-library/react";
import Login from "./components/login/login";

test("renders bindid login", () => {
  render(<Login />);
  const linkElement = screen.getByText(/Biometric Login/i);
  expect(linkElement).toBeInTheDocument();
});
