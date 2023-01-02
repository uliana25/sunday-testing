import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await userEvent.clear(vanillaInput);
  await userEvent.type(vanillaInput, "1");
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  await userEvent.clear(chocolateInput);
  await userEvent.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("24.00");
});

test('update topping subtotal', async() => {
  const user = userEvent.setup();
  render (<Options optionType="toppings" />)

  const toppingSubtotal = screen.getByText("Toppings total: $", {exact: false});
  expect(toppingSubtotal).toHaveTextContent("0.00");

  const cherryTopping = await screen.findByRole("checkbox", {name: "Cherries"});
  await user.click(cherryTopping);

  expect(toppingSubtotal).toHaveTextContent("1.50");

  const hotFudgeTopping = await screen.findByRole("checkbox", {name: "Hot fudge"});

  await user.click(hotFudgeTopping);

  expect(toppingSubtotal).toHaveTextContent("3.00");

  await user.click(hotFudgeTopping);
  expect(toppingSubtotal).toHaveTextContent("1.50");
})

describe('grand total', () => {
  test("grand total updates properly if scoop is added first", async()=>{
    const user = userEvent.setup();
    render(<OrderEntry />)
    const grandTotalTitle = screen.getByText(/Grand total: /i);
    expect(grandTotalTitle).toHaveTextContent("0.00");

    const vanillaInput = await screen.findByRole("spinbutton", {name: "Vanilla"});
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");

    const cherryCheckbox = await screen.findByRole("checkbox", {
      name: "Cherries"
    })
    await user.click(cherryCheckbox);
    expect(grandTotalTitle).toHaveTextContent("5.50");
  })

  test("grand total updates properly if topping is added first", async()=>{
    const user = userEvent.setup();
    render(<OrderEntry />)
    const grandTotalTitle = screen.getByText(/Grand total: /i);
    expect(grandTotalTitle).toHaveTextContent("0.00");

    const cherryCheckbox = await screen.findByRole("checkbox", {
      name: "Hot fudge"
    })
    await user.click(cherryCheckbox);

    const vanillaInput = await screen.findByRole("spinbutton", {name: "Vanilla"});
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");

    expect(grandTotalTitle).toHaveTextContent("5.50");
  })

  test("grand total updates properly if item is removed", async()=>{
    const user = userEvent.setup();
    render(<OrderEntry />)
    const grandTotalTitle = screen.getByText(/Grand total: /i);
    expect(grandTotalTitle).toHaveTextContent("0.00");

    const cherryCheckbox = await screen.findByRole("checkbox", {
      name: "Hot fudge"
    })
    await user.click(cherryCheckbox);

    const vanillaInput = await screen.findByRole("spinbutton", {name: "Vanilla"});
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    await user.click(cherryCheckbox);

    expect(grandTotalTitle).toHaveTextContent("2.00");
  })
});
