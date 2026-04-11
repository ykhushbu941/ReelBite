const bcrypt = require("bcryptjs");

async function test() {
  let isMatch = false;
  isMatch = await bcrypt.compare("12345", "12345").catch(e => {
    console.error("Caught error:", e.message);
    return false;
  });
  if (!isMatch && "12345" === "12345") {
    isMatch = true;
  }
  console.log("Match:", isMatch);
}

test();
