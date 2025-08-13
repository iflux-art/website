import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HoverDropdown, HoverDropdownItem } from "../hover-dropdown";

describe("HoverDropdown", () => {
  it("should show content on mouse enter and hide on mouse leave", async () => {
    render(
      <HoverDropdown
        content={
          <div>
            <HoverDropdownItem>Item 1</HoverDropdownItem>
            <HoverDropdownItem>Item 2</HoverDropdownItem>
          </div>
        }
      >
        <button>Trigger</button>
      </HoverDropdown>,
    );

    const trigger = screen.getByRole("button", { name: "Trigger" });

    // Initially, dropdown content should not be visible
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();

    // Mouse enter should show the dropdown
    fireEvent.mouseEnter(trigger);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();

    // Mouse leave should hide the dropdown after delay
    fireEvent.mouseLeave(trigger);

    // Should still be visible immediately
    expect(screen.getByText("Item 1")).toBeInTheDocument();

    // Should be hidden after delay
    await waitFor(
      () => {
        expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
      },
      { timeout: 200 },
    );
  });

  it("should not hide dropdown when moving mouse to content", async () => {
    render(
      <HoverDropdown
        content={
          <div data-testid="dropdown-content">
            <HoverDropdownItem>Item 1</HoverDropdownItem>
          </div>
        }
      >
        <button>Trigger</button>
      </HoverDropdown>,
    );

    const trigger = screen.getByRole("button", { name: "Trigger" });

    // Show dropdown
    fireEvent.mouseEnter(trigger);
    expect(screen.getByText("Item 1")).toBeInTheDocument();

    // Leave trigger but enter content
    fireEvent.mouseLeave(trigger);
    const content = screen.getByTestId("dropdown-content");
    fireEvent.mouseEnter(content);

    // Should still be visible
    await waitFor(
      () => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
      },
      { timeout: 200 },
    );
  });

  it("should apply correct alignment classes", () => {
    const { rerender } = render(
      <HoverDropdown content={<div>Content</div>} align="center">
        <button>Trigger</button>
      </HoverDropdown>,
    );

    fireEvent.mouseEnter(screen.getByRole("button"));

    // Check if center alignment class is applied
    const dropdown = screen.getByText("Content").parentElement;
    expect(dropdown).toHaveClass("left-1/2", "-translate-x-1/2");

    // Test end alignment
    rerender(
      <HoverDropdown content={<div>Content</div>} align="end">
        <button>Trigger</button>
      </HoverDropdown>,
    );

    fireEvent.mouseEnter(screen.getByRole("button"));
    const dropdownEnd = screen.getByText("Content").parentElement;
    expect(dropdownEnd).toHaveClass("right-0");
  });
});
