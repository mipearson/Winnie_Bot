const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

function runTest(x) { 
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 10000);
  });
}

// !sprint <words> <time to start> <timeout> [name]:
// Starts a sprint of <words> words in <time to start> minutes
// which times out in <timeout> minutes with optional [name]
async function sprintTest() {
  try {
    var guildObj = client.guilds.first();
    // Run with name - pass
    await runTest(guildObj.defaultChannel.send("!sprint 200 10 1 Named Sprint"));
    // Run without name - pass
    await runTest(guildObj.defaultChannel.send("!sprint 200 10 1"));
    // Run with no delay - pass, 1 minute delay
    await runTest(guildObj.defaultChannel.send("!sprint 200 10"));
    // Run starting immediately - pass
    await runTest(guildObj.defaultChannel.send("!sprint 200 10 0"));
    // Run with timeout of more than an hour - error 'Sprints cannot run for more than an hour'
    await runTest(guildObj.defaultChannel.send("!sprint 200 70 1"));
    // Run with float for goal - error 'Word goal must be a whole number'
    await runTest(guildObj.defaultChannel.send("!sprint 200.6 10 1"));
    // Run with floats for delay and timeout - pass
    await runTest(guildObj.defaultChannel.send("!sprint 200 10.1 1.5"));
    // Run with string for goal - error 'Word goal must be a whole number'
    await runTest(guildObj.defaultChannel.send("!sprint hundred 10 1"));
    // Run with string for delay - error 'Time to start must be a number'
    await runTest(guildObj.defaultChannel.send("!sprint 200 10 one"));
    // Run with string for timeout - error 'Sprint duration must be a number'
    await runTest(guildObj.defaultChannel.send("!sprint 200 ten 1"));
    // Run with negative goal - error 'Word goal cannot be negative'
    await runTest(guildObj.defaultChannel.send("!sprint -200 10 1"));
    // Run with negative delay - error 'Sprints cannot start in the past'
    await runTest(guildObj.defaultChannel.send("!sprint 200 10 -1"));
    // Run with negative timeout - error 'Sprints cannot run for a negative amount of time'
    await runTest(guildObj.defaultChannel.send("!sprint 200 -10 1"));
    // Run with executable code as the goal - error 'Word goal must be a whole number'
    await runTest(guildObj.defaultChannel.send("!sprint guildObj.defaultChannel.send(" + "\"XSS\"" + "); 10 1"));
    // Run with executable code as the timeout - error 'Sprint duration must be a number'
    await runTest(guildObj.defaultChannel.send("!sprint 200 guildObj.defaultChannel.send(" + "\"XSS\"" + "); 1"));
    // Run with executable code as the delay - error 'Time to start must be a number'
    await runTest(guildObj.defaultChannel.send("!sprint 200 10 guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with executable code as the name - fail to execute code
    await runTest(guildObj.defaultChannel.send("!sprint 200 10 1 guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with no suffix - gives help message ***not working***
    await runTest(guildObj.defaultChannel.send("!sprint"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !war <length> <delay> [name]: Starts a word war of <length> minutes in <delay> minutes with optional [name]
async function warTest() {
  try {
    var guildObj = client.guilds.first();
    // Run with name - pass
    await runTest(guildObj.defaultChannel.send("!war 10 1 Named War"));
    // Run without name - pass
    await runTest(guildObj.defaultChannel.send("!war 10 1"));
    // Run starting immediately - pass
    await runTest(guildObj.defaultChannel.send("!war 10 0"));
    // Run with no delay - pass, 1 minute delay
    await runTest(guildObj.defaultChannel.send("!war 10"));
    // Run with timeout of more than an hour - error 'Wars cannot run for more than an hour'
    await runTest(guildObj.defaultChannel.send("!war 70 1"));
    // Run with floats for delay and timeout - pass
    await runTest(guildObj.defaultChannel.send("!war 10.1 1.5"));
    // Run with string for delay - error 'Time to start must be a number'
    await runTest(guildObj.defaultChannel.send("!war 10 one"));
    // Run with string for duration - error 'War duration must be a number'
    await runTest(guildObj.defaultChannel.send("!war ten 1"));
    // Run with negative delay - error 'Wars cannot start in the past'
    await runTest(guildObj.defaultChannel.send("!war 200 10 -1"));
    // Run with negative duration - error 'Wars cannot run for a negative amount of time'
    await runTest(guildObj.defaultChannel.send("!war 200 -10 1"));
    // Run with executable code as the timeout - error 'War duration must be a number'
    await runTest(guildObj.defaultChannel.send("!war guildObj.defaultChannel.send(" + "\"XSS\"" + "); 1"));
    // Run with executable code as the delay - error 'Time to start must be a number'
    await runTest(guildObj.defaultChannel.send("!war 10 guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with executable code as the name - fail to execute code
    await runTest(guildObj.defaultChannel.send("!war 10 1 guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with no suffix - gives help message ***not working***
    await runTest(guildObj.defaultChannel.send("!war"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !join <id>: Joins war/sprint with ID <id>
// !leave <id>: Leaves war/sprint with ID <id>
// !exterminate <id>: Ends war/sprint with ID <id>. Can only be performed by creator.
async function joinLeaveTest() {
  try {
    var guildObj = client.guilds.first();
    // Start war to test
    await runTest(guildObj.defaultChannel.send("!war 3 0 Join Test"));
    // Run with ID of war not joined - pass
    await runTest(guildObj.defaultChannel.send("!join 1"));
    // Run with ID of war already joined - error 'You already have notifications enabled for this challenge'
    await runTest(guildObj.defaultChannel.send("!join 1"));
    // Run with ID of nonexistent war - error 'Challenge does not exist!'
    await runTest(guildObj.defaultChannel.send("!join 2"));
    // Run with negative integer ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!join -1"));
    // Run with float ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!join 0.1"));
    // Run with string ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!join one"));
    // Run with executable code - fail to execute code
    await runTest(guildObj.defaultChannel.send("!join guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with no suffix - gives help message ***not working***
    await runTest(guildObj.defaultChannel.send("!join"));
    // Run with ID of war not left - pass
    await runTest(guildObj.defaultChannel.send("!leave 1"));
    // Run with ID of war already left - fail
    await runTest(guildObj.defaultChannel.send("!leave 1"));
    // Run with ID of nonexistent war - error 'Challenge does not exist!'
    await runTest(guildObj.defaultChannel.send("!leave 2"));
    // Run with negative integer ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!leave -1"));
    // Run with float ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!leave 0.1"));
    // Run with string ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!leave one"));
    // Run with executable code - fail to execute code
    await runTest(guildObj.defaultChannel.send("!join guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with no suffix - gives help message ***not working***
    await runTest(guildObj.defaultChannel.send("!join"));
    // Run with ID of created war - pass
    await runTest(guildObj.defaultChannel.send("!exterminate 1"));
    // Run with ID of war already deleted - fail
    await runTest(guildObj.defaultChannel.send("!exterminate 1"));
    // Run with ID of war created by someone else - fail
    await runTest(guildObj.defaultChannel.send("!exterminate 2"));
    // Run with ID of nonexistent war - error 'Challenge does not exist!'
    await runTest(guildObj.defaultChannel.send("!exterminate 3"));
    // Run with negative integer ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!exterminate -1"));
    // Run with float ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!exterminate 0.1"));
    // Run with string ID - error 'Challenge ID must be an integer'
    await runTest(guildObj.defaultChannel.send("!exterminate one"));
    // Run with executable code - fail to execute code
    await runTest(guildObj.defaultChannel.send("!exterminate guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with no suffix - gives help message ***not working***
    await runTest(guildObj.defaultChannel.send("!exterminate"));
    // Run from a different server - fail
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !total <id> <total> [pages/lines]: Adds your <total> for completed challenge <id>, optional [pages/lines] for scriptwriters
// !summary <id>: Shows the summary for completed challenge <id>
async function summaryTest() {
  try {
  	var guildObj = client.guilds.first();
    // Start war to test - need to create 5 wars
    await runTest(guildObj.defaultChannel.send("!war 3 0 Summary Test"));
    // Run with ID of war not joined - pass
  	// Run without joining war - fail
    // Run with ID of war not created - fail
    // Run with floating-point ID - fail
    // Run with string ID - fail
    // Run with goal in pages - pass
    // Run with total in lines - pass
    // Run with total in words - pass
    // Run with total - pass
    // Run with a floating-point total - fail
    // Run with a floating-point total in lines - pass
    // Run with a floating-point total in pages - pass
    // Run with a negative total - fail
    // Run with a string total - fail
    // Run with executable code - fail
    // Run with no suffix - fail

    // Run with ID of existing war - pass
    // Run with ID of non-existing war - fail
    // Run with negative integer ID - fail
    // Run with float ID - fail
    // Run with string ID - fail
    // Run with executable code - fail
    // Run with no suffix - fail
    // !list : Lists all running sprints/wars
    // Run - pass
    // Run with executable code - fail
    // Run with a suffix - fail
  	// Run - pass
  	await runTest(guildObj.defaultChannel.send("!prompt"));
    // Run with executable code - fail
    await runTest(guildObj.defaultChannel.send("!prompt guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with suffix - fail
    await runTest(guildObj.defaultChannel.send("!prompt text"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !timezone <IANA timezone identifier>: Sets your <IANA timezone identifier>
async function tzTest() {
  try {
	var guildObj = client.guilds.first();
  	// Run !timezone administrator - angry error message
    await runTest(guildObj.defaultChannel.send("!timezone admin"));
    // Run with IANA canonical timezone - pass
    await runTest(guildObj.defaultChannel.send("!timezone Etc/GMT"));
    // Run with IANA alias timezone - fail
    await runTest(guildObj.defaultChannel.send("!timezone Etc/GMT+0"));
    // Run with IANA deprecated timezone - fail
    await runTest(guildObj.defaultChannel.send("!timezone Poland"));
    // Run with number input - fail
    await runTest(guildObj.defaultChannel.send("!timezone 10"));
    // Run with string input - fail
    await runTest(guildObj.defaultChannel.send("!timezone Etc"));
    // Run with executable code - fail
    await runTest(guildObj.defaultChannel.send("!timezone guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
      // Run without suffix - display help message **not working**
    await runTest(guildObj.defaultChannel.send("!timezone"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !set <goal> [lines|pages|minutes]: Sets a daily goal <goal>, with optional [lines|pages|minutes]
// !update <words>: Updates your daily goal with the number of <words> you have completed since your last update
// !progress <words>: Updates your daily goal with the total number of <words> you have completed today
// !reset : Resets your daily goal
// !goalinfo : Displays progress towards your daily goal
async function goalTest() {
  try {
  	var guildObj = client.guilds.first();
  	// Run with goal already set - fail
    // Run with goal in minutes - pass
    // Run with goal in pages - pass
    // Run with goal in lines - pass
    // Run with goal in words - pass
    // Run with goal in number - fail
    // Run with goal in string - fail
    // Run with goal - pass
    // Run with floating-point goal - fail
    // Run with executable code as goal - fail
    // Run with no suffix - fail

    // Run without goal set - fail
    // Run with goal in minutes set - pass
    // Run with goal in pages set - pass
    // Run with goal in lines set - pass
    // Run with goal in words set - pass
    // Run with goal set - pass
    // Run with goal in minutes progressed - add
    // Run with goal in pages progressed - add
    // Run with goal in lines progressed - add
    // Run with goal in words progressed - add
    // Run with goal progressed - add
    // Run with executable code - fail
    // Run with a suffix - fail

    // Run without goal set - fail
    // Run with goal in minutes set - pass
    // Run with goal in pages set - pass
    // Run with goal in lines set - pass
    // Run with goal in words set - pass
    // Run with goal set - pass
    // Run with goal in minutes progressed - overwrite
    // Run with goal in pages progressed - overwrite
    // Run with goal in lines progressed - overwrite
    // Run with goal in words progressed - overwrite
    // Run with goal progressed - overwrite
    // Run with executable code - fail
    // Run with suffix - fail

    // Run with no goal set - fail
    // Run with goal set - pass
    // Run with executable code - fail
    // Run with suffix - fail

    // Run without goal set - fail
    // Run with goal in minutes set - pass
    // Run with goal in pages set - pass
    // Run with goal in lines set - pass
    // Run with goal in words set - pass
    // Run with goal set - pass
    // Run with goal in minutes progressed - pass
    // Run with goal in pages progressed - pass
    // Run with goal in lines progressed - pass
    // Run with goal in words progressed - pass
    // Run with goal progressed - pass
    // Run with executable code - fail
    // Run with suffix - fail
  	// Run - pass
  	await runTest(guildObj.defaultChannel.send("!prompt"));
    // Run with executable code - fail
    await runTest(guildObj.defaultChannel.send("!prompt guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with suffix - fail
    await runTest(guildObj.defaultChannel.send("!prompt one"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !target <easy/average/hard> <time>: Generates an <easy/average/hard> target for <time> minutes
async function targetTest() {
  try {
  	var guildObj = client.guilds.first();
  	// Run with no difficulty - fail
  	await runTest(guildObj.defaultChannel.send("!target 15"));
    // Run with no time - fail
    await runTest(guildObj.defaultChannel.send("!target easy"));
    // Run with easy target - pass
    await runTest(guildObj.defaultChannel.send("!target easy 15"));
    // Run with average target - pass
    await runTest(guildObj.defaultChannel.send("!target average 15"));
    // Run with hard target - pass
    await runTest(guildObj.defaultChannel.send("!target hard 15"));
    // Run with -1 target - fail
    await runTest(guildObj.defaultChannel.send("!target easy -1"));
    // Run with ‘string’ target - fail
    await runTest(guildObj.defaultChannel.send("!target easy fifteen"));
    // Run with integer difficulty - fail
    await runTest(guildObj.defaultChannel.send("!target 1 15"));
      // Run with executable code as difficulty - fail
    await runTest(guildObj.defaultChannel.send("!target guildObj.defaultChannel.send(" + "\"XSS\"" + "); 15"));
    // Run with executable code as time - fail
    await runTest(guildObj.defaultChannel.send("!target easy guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));	
    // Run without suffix - display help message **not working**
    await runTest(guildObj.defaultChannel.send("!target"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !roll <x> [y], <x>d<y>: Rolls a die
async function rollTest() {
  try {
  	var guildObj = client.guilds.first();
    // Roll a die - pass
    await runTest(guildObj.defaultChannel.send("!roll 6"));
    // Roll a range - pass
    await runTest(guildObj.defaultChannel.send("!roll 3 6"));
    // Roll multiple dice - pass
    await runTest(guildObj.defaultChannel.send("!roll 2d6"));
    // Roll a very large number of dice - fail
    await runTest(guildObj.defaultChannel.send("!roll 2000d6"));
    // Run with executable code - fail
    await runTest(guildObj.defaultChannel.send("!roll guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
      // Run without suffix - display help message **not working**
    await runTest(guildObj.defaultChannel.send("!roll"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !prompt : Provides a writing prompt
async function promptTest() {
  try{
  	var guildObj = client.guilds.first();
  	// Run - pass
  	await runTest(guildObj.defaultChannel.send("!prompt"));
    // Run with executable code - fail
    await runTest(guildObj.defaultChannel.send("!prompt guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
    // Run with suffix - fail
    await runTest(guildObj.defaultChannel.send("!prompt text"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}

// !choose <list>: Selects an item from a list <list> of items, separated by commas
async function chooseTest() {
  try{
  	var guildObj = client.guilds.first();
    // Run with a single item - fail
    await runTest(guildObj.defaultChannel.send("!choose one two three"));
    // Run with multiple items, separated with the wrong delineator - fail
    await runTest(guildObj.defaultChannel.send("!choose one; two; three"));
    // Run with multiple comma-separated items - pass
    await runTest(guildObj.defaultChannel.send("!choose one, two, three"));
    // Run with executable code - fail
    await runTest(guildObj.defaultChannel.send("!choose guildObj.defaultChannel.send(" + "\"XSS\"" + ");"));
      // Run without suffix - display help message **not working**
    await runTest(guildObj.defaultChannel.send("!choose"));
  } catch (e) {
    console.log("Error: %s, %s", e, e.stack);
  }
}


async function startTest() {
  await client.login(config.test_token);
  // sprintTest();
  // warTest();
  // joinLeaveTest();
  // summaryTest();
  // tzTest();
  // goalTest();
  // targetTest();
  // rollTest();
  // promptTest();
  // chooseTest();
}

startTest();