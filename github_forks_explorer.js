// ==UserScript==
// @name        GitHub Forks Explorer
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*/*
// @version     1.0
// @author      Anodynous
// @description Adds a table to the top of GitHub repositories, displaying a sorted and filtered overview of related forks.
// ==/UserScript==

(function() {
    'use strict';

    // Cache for forks data
    var forksDataCache = null;
    var currentUrl = window.location.href;

    // Function to fetch data from GitHub API
    function fetchForksData(username, repository) {
        var apiUrl = `https://api.github.com/repos/${username}/${repository}/forks?per_page=100&sort=${getSortOrder()}&page=1`;
        console.log(`Fetching forks data from GitHub API for ${username}/${repository}/...`);
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(forksData => {
                forksDataCache = forksData; // Cache the fetched data
                displayForksData(forksData);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Function to display forks data
    function displayForksData(forksData) {
        // Remove existing fork data container if it exists
        var existingContainer = document.querySelector('.forks-viewer-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        var container = document.createElement('div');
        container.className = 'forks-viewer-container';
        container.style.margin = '60px 20px 20px';
        container.style.padding = '20px';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.backgroundColor = '#f9f9f9';

        // Create and append settings panel
        container.appendChild(createSettingsPanel());

        // Filter forks based on minStars
        var filteredForks = forksData.filter(fork => {
            return fork.stargazers_count >= getMinStars();
        });

        // Limit the number of entries to maxEntries
        var displayedForks = filteredForks.slice(0, getMaxEntries());
        var excludedCount = forksData.length - displayedForks.length;

        var table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        // Create table header
        var thead = document.createElement('thead');
        var headerRow = document.createElement('tr');
        ['Repository', 'Owner', 'Description', 'Language', 'Stars', 'Watchers', 'Forks', 'Open Issues'].forEach(function(headerText) {
            var th = document.createElement('th');
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        var tbody = document.createElement('tbody');
        if (displayedForks.length === 0) {
            var row = document.createElement('tr');
            ['Repository', 'Owner', 'Description', 'Language', 'Stars', 'Watchers', 'Forks', 'Open Issues'].forEach(function() {
                var cell = document.createElement('td');
                cell.style.border = '1px solid #ddd';
                cell.style.padding = '8px';
                cell.textContent = '';
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        } else {
            displayedForks.forEach(function(fork) {
                var row = document.createElement('tr');

                // Repository link
                var repoCell = document.createElement('td');
                var repoLink = document.createElement('a');
                repoLink.href = fork.html_url;
                repoLink.textContent = fork.name;
                repoLink.target = '_blank';
                repoCell.appendChild(repoLink);
                repoCell.style.border = '1px solid #ddd';
                repoCell.style.padding = '8px';
                row.appendChild(repoCell);

                // Owner
                var ownerCell = document.createElement('td');
                ownerCell.textContent = fork.owner.login;
                ownerCell.style.border = '1px solid #ddd';
                ownerCell.style.padding = '8px';
                row.appendChild(ownerCell);

                // Description
                var descriptionCell = document.createElement('td');
                descriptionCell.textContent = fork.description || 'No description';
                descriptionCell.style.border = '1px solid #ddd';
                descriptionCell.style.padding = '8px';
                row.appendChild(descriptionCell);

                // Language
                var languageCell = document.createElement('td');
                languageCell.textContent = fork.language || 'N/A';
                languageCell.style.border = '1px solid #ddd';
                languageCell.style.padding = '8px';
                row.appendChild(languageCell);

                // Stars
                var starsCell = document.createElement('td');
                starsCell.textContent = fork.stargazers_count;
                starsCell.style.border = '1px solid #ddd';
                starsCell.style.padding = '8px';
                row.appendChild(starsCell);

                // Watchers
                var watchersCell = document.createElement('td');
                watchersCell.textContent = fork.watchers_count;
                watchersCell.style.border = '1px solid #ddd';
                watchersCell.style.padding = '8px';
                row.appendChild(watchersCell);

                // Forks
                var forksCell = document.createElement('td');
                forksCell.textContent = fork.forks_count;
                forksCell.style.border = '1px solid #ddd';
                forksCell.style.padding = '8px';
                row.appendChild(forksCell);

                // Open Issues
                var issuesCell = document.createElement('td');
                issuesCell.textContent = fork.open_issues;
                issuesCell.style.border = '1px solid #ddd';
                issuesCell.style.padding = '8px';
                row.appendChild(issuesCell);

                tbody.appendChild(row);
            });
        }
        table.appendChild(tbody);

        container.appendChild(table);

        // Display the number of excluded forks
        var excludedMessage = document.createElement('p');
        excludedMessage.textContent = `(${excludedCount}/${forksData.length} forks excluded by current filters)`;
        container.appendChild(excludedMessage);

        // Insert the container at the top of the page
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Function to create and display settings panel
    function createSettingsPanel() {
        var settingsPanel = document.createElement('div');
        settingsPanel.style.marginBottom = '20px';

        // Min Stars input
        var minStarsLabel = document.createElement('label');
        minStarsLabel.textContent = 'Min Stars: ';
        var minStarsInput = document.createElement('input');
        minStarsInput.type = 'number';
        minStarsInput.value = getMinStars();
        minStarsInput.style.marginRight = '10px';
        minStarsInput.addEventListener('change', function() {
            var minStarsValue = parseInt(minStarsInput.value);
            if (minStarsValue < 0) {
                minStarsValue = 0;
                minStarsInput.value = minStarsValue;
            }
            localStorage.setItem('minStars', minStarsValue);
            displayForksData(forksDataCache); // Use cached data
        });
        settingsPanel.appendChild(minStarsLabel);
        settingsPanel.appendChild(minStarsInput);

        // Max Entries input
        var maxEntriesLabel = document.createElement('label');
        maxEntriesLabel.textContent = 'Max Entries: ';
        var maxEntriesInput = document.createElement('input');
        maxEntriesInput.type = 'number';
        maxEntriesInput.value = getMaxEntries();
        maxEntriesInput.style.marginRight = '10px';
        maxEntriesInput.addEventListener('change', function() {
            localStorage.setItem('maxEntries', parseInt(maxEntriesInput.value));
            displayForksData(forksDataCache); // Use cached data
        });
        settingsPanel.appendChild(maxEntriesLabel);
        settingsPanel.appendChild(maxEntriesInput);

        // Sort Order select
        var sortOrderLabel = document.createElement('label');
        sortOrderLabel.textContent = 'Sort Order: ';
        var sortOrderSelect = document.createElement('select');
        ['watchers', 'stargazers', 'newest', 'oldest'].forEach(function(optionText) {
            var option = document.createElement('option');
            option.value = optionText;
            option.textContent = optionText.charAt(0).toUpperCase() + optionText.slice(1);
            if (optionText === getSortOrder()) {
                option.selected = true;
            }
            sortOrderSelect.appendChild(option);
        });
        sortOrderSelect.style.marginRight = '10px';
        sortOrderSelect.addEventListener('change', function() {
            localStorage.setItem('sortOrder', sortOrderSelect.value);
            fetchForksData(username, repository); // Fetch new data
        });
        settingsPanel.appendChild(sortOrderLabel);
        settingsPanel.appendChild(sortOrderSelect);

        return settingsPanel;
    }

    // Helper function to get minStars from localStorage
    function getMinStars() {
        return parseInt(localStorage.getItem('minStars')) || 0;
    }

    // Helper function to get maxEntries from localStorage
    function getMaxEntries() {
        return parseInt(localStorage.getItem('maxEntries')) || 5;
    }

    // Helper function to get sortOrder from localStorage
    function getSortOrder() {
        return localStorage.getItem('sortOrder') || 'watchers';
    }

    // Extract username and repository name from the current URL
    function extractRepoInfo() {
        var currentUrl = window.location.href;
        var regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)/;
        var match = currentUrl.match(regex);

        if (match) {
            return {
                username: match[1],
                repository: match[2]
            };
        } else {
            console.error('Could not extract username and repository from URL');
            return null;
        }
    }5

    // Function to handle URL changes
    function handleUrlChange() {
        var repoInfo = extractRepoInfo();
        if (repoInfo) {
            if (repoInfo.username !== username || repoInfo.repository !== repository) {
                username = repoInfo.username;
                repository = repoInfo.repository;
                fetchForksData(username, repository);
            }
        }
    }

    // Initial extraction of username and repository
    var { username, repository } = extractRepoInfo();
    if (username && repository) {
        fetchForksData(username, repository);
    }

    // Listen for URL changes
    window.addEventListener('popstate', handleUrlChange);

    // Periodically check the URL for changes
    setInterval(function() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            handleUrlChange();
        }
    }, 500); // Check every 500 milliseconds
})();
