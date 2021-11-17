const coffee = [
  { name: "cappuccino", id: "cappuccino" },

  { name: "latte", id: "latte" },

  { name: "americano", id: "americano" },
];

const dessert = [
  { name: "cheesecake", id: "cheesecake" },

  { name: "brownie", id: "brownie" },

  { name: "apple pie", id: "apple-pie" },
];

let coffeePattern = coffee.map((item) => `${item.name}`).join("|");

let dessertPattern = dessert.map((item) => `${item.name}`).join("|");

console.log(coffeePattern, dessertPattern);

intent("What does this app do?", (p) => {
  p.play("This is a coffee ordering app.");
});

intent("What coffee do you have?", (p) => {
  p.play("We have:");
  for (let i = 0; i < coffee.length; i++) {
    let item = coffee[i].name;
    p.play({ command: "highlight", item: coffee[i].id });
    p.play(`${item}`);
  }
});

intent(
  `Get me (a|an) $(COFFEE ${coffeePattern})`,
  `I want a $(COFFEE ${coffeePattern}), (please|)`,
  `I (need|want) $(COFFEE ${coffeePattern})`,
  (p) => {
    p.userData.coffee = p.COFFEE.value;
    p.play({ command: "addCoffee", item: p.COFFEE.value });
    p.play(`Adding one ${p.COFFEE.value} to your order`, "Sure");
    p.play("Please choose a dessert.");
    p.then(orderDessert);
  }
);

let orderDessert = context(() => {
  intent(
    `Get me a $(DESSERT ${dessertPattern})`,
    `One $(DESSERT ${dessertPattern}) , (please|)`,
    `I (need|want) $(DESSERT ${dessertPattern})`,
    (p) => {
      p.userData.dessert = p.DESSERT.value;
      p.play({ command: "addDessert", item: p.DESSERT.value });
      p.play(`Adding one ${p.DESSERT.value} to your order`, "Sure");
      p.play("What is your name?");
      p.then(checkout);
    }
  );
});

let checkout = context(() => {
  intent(`My name is $(NAME)`, (p) => {
    p.userData.name = p.NAME.value;
    p.play({ command: "addName", name: p.NAME.value });
    p.play(`Thank you ${p.NAME.value}`);
    p.play("Please provide your address");
  });

  intent(`My address is $(LOC)`, (p) => {
    p.userData.address = p.LOC.value;
    p.play({ command: "addAddress", address: p.LOC.value });
    p.play(`Thank you we will deliver your order to ${p.LOC.value}`);
    p.play("Any comments?");
  });

  intent("My comment is $(COMMENT* (.+))", (p) => {
    p.userData.comment = p.COMMENT.value;
    p.play({ command: "addComment", comment: p.COMMENT.value });
    p.play("Thank you will take a note");
    p.play(`You have ordered ${p.userData.coffee} and ${p.userData.dessert}`);
    p.play(`Delivering to ${p.userData.address} for ${p.userData.name}`);
    p.play(`Your comment is ${p.userData.comment}`);
    p.play("Is your order correct?");
    p.then(confirmOrder);
  });
});

let confirmOrder = context(() => {
  intent("Yes (it is correct|)", (p) => {
    p.play("Thank you");
    p.resolve();
  });
  intent("No (I want to change it|)", (p) => {
    p.play("Sure ,take your time");
    p.resolve();
  });
  fallback("You have to say Yes or No");
});
fallback("Sorry", "Come again?", "I beg your pardon?");

intent("How much is the delivery?", (p) => {
  p.play(`The delivery cost is ${project.cost.delivery} dollars`);
});

intent("What is in the cart?", (p) => {
  p.play(`You have ordered ${p.userData.coffee} ${p.userData.dessert}`);
});
