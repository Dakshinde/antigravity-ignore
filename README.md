# 🚀 Antigravity Ignore

**Smart `.gitignore` management engineered for modern monorepos.**

Eliminate the friction of maintaining Git rules. `Antigravity Ignore` provides intelligent, workspace-aware pathing right from your VS Code Explorer context menu. Stop manually typing file paths, and stop creating accidental "shadow ignores" in your project subdirectories.

## ✨ Features

- **Contextual Right-Click:** Simply right-click any file or folder in your Explorer and click `Antigravity: Add to .gitignore`.
- **Smart Path Normalization:** Automatically calculates the relative path from the `.gitignore` to your clicked file, and strictly formats it with Git-compliant POSIX forward-slashes (even on Windows).
- **Duplicate Prevention:** Safely scans your `.gitignore` to ensure the rule isn't already there.
- **Hoisting Intelligence:** If you try to add an ignore rule inside a nested folder (like `/frontend`) but a root `.gitignore` exists, Antigravity steps in. It intelligently prompts you to "Hoist" the rule up to the project root, keeping your repository clean and avoiding untraceable "shadow" ignores.

## 🛠️ Usage

1. Open your project in VS Code.
2. In the Explorer pane, **Right-Click** the file or folder you want to ignore.
3. Select **"Antigravity: Add to .gitignore"** from the context menu.
4. If a nested `.gitignore` conflict is detected, you will be prompted to choose where to safely deposit the rule.
5. Click **Open File** on the success pop-up to instantly verify the change.

## ⚙️ Installation (Development)

To contribute or run this extension locally:

```bash
# Clone the repository
git clone https://github.com/Dakshinde/antigravity-ignore.git
cd antigravity-ignore

# Install dependencies
npm install

# Compile the extension
npm run compile
```

Press **F5** in VS Code to launch the Extension Development Host window and test the extension out.

## 📝 License
This project is licensed under the [MIT License](LICENSE).
