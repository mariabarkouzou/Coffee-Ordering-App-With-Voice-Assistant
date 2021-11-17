const coffee = [

  {name: 'cappuccino', id: 'cappuccino'},
  
  {name: 'latte', id: 'latte'},
  
  {name: 'americano', id: 'americano'}
  
  ];
  
  const dessert = [
  
  {name: 'cheesecake', id: 'cheesecake'},
  
  {name: 'brownie', id: 'brownie'},
  
  {name: 'apple pie', id: 'apple-pie'}
  
  ];
  
  let coffeePattern = coffee.map(item => `${item.name}`).join('|');
  
  let dessertPattern = dessert.map(item => `${item.name}`).join('|');
  
  console.log(coffeePattern, dessertPattern);
  
  
  intent('What can I order here?', p => {
      p.play('(You can order a coffee and a dessert)');
  });
  
  
  intent('What coffee do you have?', p => {
      p.play('We have:');
      for(let i=0; i<coffee.length; i++){
          let item = coffee[i].name;
          p.play({command:'highlight' , item: coffee[i].id});
          p.play(`${item}`)
      }
  });
  
  intent(`Get me (a|an) $(COFFEE ${coffeePattern})` , `I want a $(COFFEE ${coffeePattern}), (please|)` , `I (need|want) $(COFFEE ${coffeePattern})`,
         p => {
      p.play({command:'addCoffee' , item:p.COFFEE.value})
      p.play(`Adding one ${p.COFFEE.value} to your order`, 'Sure');
      p.play('Would you like a dessert?We have cheesecake , brownie and apple pie.')
      p.then(orderDessert)
  });
  
  let orderDessert = context(() => { 
  intent(`Get me a $(DESSERT ${dessertPattern})` , `One $(DESSERT ${dessertPattern}) , (please|)`  , `I (need|want) $(DESSERT ${dessertPattern})`, p => {
      p.play({command: 'addDessert' , item:p.DESSERT.value})
      p.play(`Adding one ${p.DESSERT.value} to your order`, 'Sure');
      p.play('What is your name?')
      p.then(checkout)
      
  });
  })
  
  
  let checkout = context(() => { 
  intent(`My name is $(NAME)` , p => {
      p.play({command: 'addName' , name: p.NAME.value})
      p.play(`Thank you ${p.NAME.value}`);
      p.play('Please provide your address')
  });
  
  
  
  intent(`My address is $(LOC)` , p => {
      p.play({command: 'addAddress' , address: p.LOC.value})
      p.play(`Thank you we will deliver your order to ${p.LOC.value}`);
      p.play('Any comments?')
  });
  
  intent('My comment is $(COMMENT* (.+))' , p => {
      p.play({command: 'addComment' , comment: p.COMMENT.value})
      p.play('Thank you will take a note');
      p.play('Is your order correct?')
      p.then(confirmOrder)
  });
  })
      
  let confirmOrder = context(() => {
      intent('Yes (it is correct|)', p => {
      p.play('Thank you');
          p.resolve()
  });
   intent('No (I want to change it|)', p => {
      p.play('Sure ,take your time');
       p.resolve()
  });
  })
  