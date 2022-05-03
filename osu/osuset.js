const fs = require("fs");
const { osulogdir } = require("../logconfig.json");
const { getStackTrace } = require("../somestuffidk/log");

module.exports = {
  name: "osuset",
  description:
    "Sets your osu! username so you can use osu! commands without specifying a username.",
  async execute(
    userdatatags,
    interaction,
    options,
    Discord,
    currentDate,
    currentDateISO
  ) {
    const pickeduserX = options.getString("username");
    fs.appendFileSync(osulogdir, "\n" + `${currentDateISO} | ${currentDate}`);
    fs.appendFileSync(osulogdir, "\n" + "command executed - osu set");
    fs.appendFileSync(osulogdir, "\n" + "category - osu (no api usage)");
    let consoleloguserweeee = interaction.member.user;
    fs.appendFileSync(
      osulogdir,
      "\n" +
        `requested by ${consoleloguserweeee.id} aka ${consoleloguserweeee.tag}`
    );
    fs.appendFileSync(osulogdir, "\n" + "");
    //interaction.reply('...')
    let type = options.getString("type");
    fs.appendFileSync(osulogdir, "\n" + type + "|");
    if (
      !type ||
      type == "username" ||
      type == "name" ||
      type == "user" ||
      type == null ||
      type == "null"
    ) {
      try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        await userdatatags.create({
          name: interaction.member.user.id,
          description: pickeduserX,
          username: interaction.member.user.id,
          mode: "osu",
        });

        interaction.reply(`${pickeduserX} added.`);
        fs.appendFileSync(osulogdir, "\n" + "sent");
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          affectedRows = await userdatatags.update(
            { description: pickeduserX },
            { where: { name: interaction.member.user.id } }
          );

          if (affectedRows > 0) {
            return interaction.reply(`username updated.`);
          }
          //return interaction.reply('That username is already taken.');
        }

        interaction.reply("Something went wrong with adding a username.");
        return fs.appendFileSync(osulogdir, "\n" + error);
      }
    } else if (type == "mode") {
      try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        await userdatatags.create({
          name: interaction.member.user.id,
          username: interaction.member.user.id,
          mode: pickeduserX,
        });

        interaction.reply(`${pickeduserX} added.`);
        fs.appendFileSync(osulogdir, "\n" + "sent");
      } catch (error) {
        //fs.appendFileSync(osulogdir, "\n" + error)
        if (error.name === "SequelizeUniqueConstraintError") {
          affectedRows = await userdatatags.update(
            { mode: pickeduserX },
            { where: { name: interaction.member.user.id } }
          );

          if (affectedRows > 0) {
            return interaction.reply(`mode updated.`);
          }
          //return interaction.reply('That username is already taken.');
        }

        interaction.reply("Something went wrong with editing mode.");
        return fs.appendFileSync(osulogdir, "\n" + error);
      }
    } else if (
      type == "haloinfiniteprofile" ||
      type == "xbox" ||
      type == "xboxlive" ||
      type == "xbx"
    ) {
      try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        await userdatatags.create({
          name: interaction.member.user.id,
          username: interaction.member.user.id,
          xboxlive: pickeduserX,
        });

        interaction.reply(`${pickeduserX} added to xbox live username.`);
        fs.appendFileSync(osulogdir, "\n" + "sent");
      } catch (error) {
        //fs.appendFileSync(osulogdir, "\n" + error)
        if (error.name === "SequelizeUniqueConstraintError") {
          affectedRows = await userdatatags.update(
            { xboxlive: pickeduserX },
            { where: { name: interaction.member.user.id } }
          );

          if (affectedRows > 0) {
            return interaction.reply(`xbox live username updated.`);
          }
          //return interaction.reply('That username is already taken.');
        }

        interaction.reply(
          "Something went wrong with editing xbox live username."
        );
        return fs.appendFileSync(osulogdir, "\n" + error);
      }
    } else if (type == "steam") {
      try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        await userdatatags.create({
          name: interaction.member.user.id,
          username: interaction.member.user.id,
          steamusername: pickeduserX,
        });

        interaction.reply(`${pickeduserX} added to steam username.`);
        fs.appendFileSync(osulogdir, "\n" + "sent");
      } catch (error) {
        //fs.appendFileSync(osulogdir, "\n" + error)
        if (error.name === "SequelizeUniqueConstraintError") {
          affectedRows = await userdatatags.update(
            { steamusername: pickeduserX },
            { where: { name: interaction.member.user.id } }
          );

          if (affectedRows > 0) {
            return interaction.reply(`steam username updated.`);
          }
          //return interaction.reply('That username is already taken.');
        }

        interaction.reply("Something went wrong with editing steam username.");
        fs.appendFileSync(osulogdir, "\n" + error);
        fs.appendFileSync(osulogdir, "\n" + getStackTrace(error));
        return;
      }
    } else {
      //return interaction.channel.send("error - can only update mode or username")
    }
  },
};
