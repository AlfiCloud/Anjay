import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import chalk from "chalk";
import boxen from "boxen";

const path = "./data.json";
const git = simpleGit();

// 📌 Display UI Helper
const displayUI = (message, type = "info") => {
  const colors = { info: "blue", success: "green", warning: "yellow", error: "red" };
  console.log(
    boxen(chalk[colors[type]](message), {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: colors[type],
    })
  );
};

// 📌 Generate Commit Data
const generateCommitData = (n) => {
  return Array.from({ length: n }).map((_, i) => {
    const x = random.int(0, 54);
    const y = random.int(0, 6);
    const date = moment().subtract(1, "y").add(1, "d").add(x, "w").add(y, "d").format();

    return {
      date: date,
      commit: {
        message: `Commit #${i + 1} on ${date}`,
        author: "reniandin94@gmail.com",
        branch: "main",
      },
    };
  });
};

// 📌 Execute Batch Commit Process
const makeCommits = async (n) => {
  try {
    const commits = generateCommitData(n);
    
    // Simpan semua perubahan di JSON tanpa delay
    await jsonfile.writeFile(path, commits, { spaces: 2 });

    // Tambahkan semua perubahan dan buat commit secara batch
    await git.add([path]);
    
    await Promise.all(
      commits.map(({ date, commit }) =>
        git.commit(commit.message, { "--date": date })
      )
    );

    // Push setelah semua commit selesai
    await git.push();
    displayUI("🎉 All commits have been created and pushed!", "success");
  } catch (error) {
    displayUI(`❌ Error: ${error.message}`, "error");
  }
};

// 🔥 Start Commit Process
displayUI(
  "🚀 Starting the automated commit process...\n" +
    chalk.yellow("Project: Anjay\n") +
    chalk.yellow("Version: 1.0.0"),
  "info"
);

makeCommits(50000);
