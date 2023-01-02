import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";

test('order phases for happy path', async()=> {
// render app
const user = userEvent.setup();
render (<App />)

// add ice cream scoops and toppings
const chocolateInput = await screen.findByRole("spinbutton", {
  name: "Chocolate",
});
await userEvent.clear(chocolateInput);
await userEvent.type(chocolateInput, "3");

const cherriesCheckbox = await screen.findByRole("checkbox", {name: /cherries/i});
await user.click(cherriesCheckbox);

// find and click order button
const orderSummaryButton = screen.getByRole("button", {
  name: /order sundae/i,
});
await user.click(orderSummaryButton);


// check summary information based on order

const scoopsHeading = screen.getByRole("heading", {name:"Scoops: $6.00"});
expect(scoopsHeading).toBeInTheDocument();

const toppingsHeading = screen.getByRole("heading", {name: /Toppings/i});
expect(toppingsHeading).toBeInTheDocument()

expect(screen.getByText("3 Chocolate")).toBeInTheDocument();
expect(screen.getByText("Cherries")).toBeInTheDocument();
//accept terms and conditions and click button to confirm order
const confirmCheckbox = screen.getByRole("checkbox", {
  name: /terms and conditions/i
});

await user.click(confirmCheckbox);

const confirmOrderButton = screen.getByRole("button", {
  name: /confirm order/i,
});
await user.click(confirmOrderButton);

const thankYouHead = await screen.findByRole("heading", {
  name: /thank you!/i
})

expect(thankYouHead).toBeInTheDocument();
//confirm order number on confirmation page

const orderNumber = await screen.findByText(/order number/i);
expect(orderNumber).toBeInTheDocument();

//click "new order" button on confirmation page
const newOrderButton = screen.getByRole("button", { name: /new order/i });
await user.click(newOrderButton);

//check that scoops and toppings subtotals have been reset
const scoopsTotal = await screen.findByText("Scoops total: $0.00");
expect(scoopsTotal).toBeInTheDocument();
const toppingsTotal = screen.getByText("Toppings total: $0.00");
expect(toppingsTotal).toBeInTheDocument();

//do we need to awaitanything to avoid test errors
await screen.findByRole("spinbutton", { name: "Vanilla" });
await screen.findByRole("checkbox", { name: "Cherries" });
});
