#!/usr/bin/env node

import fetch from "node-fetch";
import chalk from "chalk";
import ora from "ora";
import { Command } from "commander";

const program = new Command();

program
  .name("github-activity")
  .description("Fetch recent GitHub activity of a user")
  .version("1.0.0");

program
  .argument("<username>", "GitHub username")
  .action(async (username) => {
    if (!username.trim()) {
      console.log(chalk.red("❌ Please provide a GitHub username!"));
      process.exit(1);
    }

    const url = `https://api.github.com/users/${username}/events/public`;
    const spinner = ora("Fetching GitHub activity...").start();

    try {
      const response = await fetch(url);
      const events = await response.json();
      spinner.stop();

      if (!Array.isArray(events) || events.length === 0) {
        console.log(chalk.yellow("⚠️ No recent public activity found."));
        return;
      }

      console.log(chalk.blue(`\nRecent GitHub Activity for ${username}:`));
      events.slice(0, 5).forEach(event => {
        console.log(chalk.green(`- ${event.type} at ${event.repo.name} (${new Date(event.created_at).toLocaleString()})`));
      });
    } catch (error) {
      spinner.stop();
      console.log(chalk.red("❌ Error fetching data: "), error.message);
    }
  });

program.parse(process.argv);
