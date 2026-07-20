// @vitest-environment happy-dom

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it } from "vitest";
import { TrailGuide } from "./TrailGuide";

describe("TrailGuide", () => {
  it("presents Scout as a non-interactive, contextual guide", () => {
    render(<TrailGuide message="The trail is ready." mood="pointing" />);
    expect(screen.getByLabelText("Scout, your AI trail guide")).toHaveTextContent("The trail is ready.");
    expect(screen.getByRole("img", { name: "Scout pointing ahead" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
