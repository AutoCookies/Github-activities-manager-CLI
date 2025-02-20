import fetch from "node-fetch";
import chalk from "chalk";
import ora from "ora";
import readline from "readline/promises";
import process from "process";

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const username = await rl.question(chalk.blue("Type in GitHub username: "));
rl.close();

if (!username.trim()) {
    console.log(chalk.red("❌ Please provide a GitHub username!"));
    process.exit(1);
}

const url = `https://api.github.com/users/${username}/events/public`;
const spinner = ora("Fetching GitHub activity...").start();

fetch(url)
    .then(response => response.json())
    .then(events => {
        spinner.stop();
        if (!Array.isArray(events) || events.length === 0) {
            console.log(chalk.yellow("⚠️ No recent public activity found."));
            return;
        }

        console.log(chalk.blue(`\nRecent GitHub Activity for ${username}:`));
        events.slice(0, 5).forEach(event => {
            console.log(chalk.green(`- ${event.type} at ${event.repo.name} (${new Date(event.created_at).toLocaleString()})`));
        });
    })
    .catch(error => {
        spinner.stop();
        console.log(chalk.red("❌ Error fetching data: "), error.message);
    });