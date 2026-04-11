const bcrypt = require("bcryptjs");

async function test() {
  const isMatch = await bcrypt.compare("mypassword", "$2b$10$8qn1tfnTvs6YLPsF8X80ve/KBI/m7V82XpJPbbkZVulEFvd2YXiJ.").catch(e => {
    console.error(e);
    return false;
  });
  console.log("Match:", isMatch);
}

test();
