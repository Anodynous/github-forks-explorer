# GitHub Forks Explorer

## Overview

GitHub Forks Explorer is a userscript enhancing GitHub repository pages by adding a table displaying a sorted and filtered overview of related forks. This script allows you to easily view and compare forks based on various criteria such as stars, watchers, forks, and open issues.

## Features

- **Sort**: View forks sorted by different criteria (watchers, stars, age).
- **Filter**: Filter forks by a minimum number of stars.
- **Limited Entries**: Limit the maximum number of forks displayed.
- **Persistent Settings**: Save your settings (minimum stars, maximum entries, sort order) using `localStorage`.

## Installation

### Prerequisites

- A browser that supports UserScripts (e.g., Firefox, Google Chrome).
- A UserScript manager extension (e.g., Violentmonkey, Tampermonkey).

### Steps

1. **Install a UserScript Manager**:
   - For **Firefox**: Install [Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/) or [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/).
   - For **Chrome**: Install [Violentmonkey](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) or [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).

2. **Install the GitHub Forks Explorer Script**:
   - Download `github_forks_explorer.js` from this depository.
   - Open your UserScript manager and import the script.
   - Ensure it is activated and enabled.

## Usage

1. **Navigate to a GitHub Repository**:
   - Go to any GitHub repository page or reload this page.

2. **View Forks Data**:
   - A new table will appear at the top of the repository page, displaying the forks sorted and filtered according to your settings.

## Configuration

### Settings Panel

The settings panel allows you to configure the following options:

- **Min Stars**: Set the minimum number of stars a fork must have to be displayed.
- **Max Entries**: Set the maximum number of forks to display.
- **Sort Order**: Choose the sorting order for the forks (watchers, stars, newest, oldest).

### Persistent Settings

Your settings are saved using `localStorage`, so they will persist across browser sessions and different repositories.

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
